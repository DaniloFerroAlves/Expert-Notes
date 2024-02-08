import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {



    // UseState pra fazer a boolean que vai abrir o textarea ou não
    const [shouldShowOnboarding, setshouldShowOnboarding] = useState(true)

    // hook pra pegar a string que é digitada que atualiza no evento onchange
    const [content, setContent] = useState('')

    const [isRecording, setIsRecording] = useState(false)


    // Função pra começar a escrever, muda pra false para que a condição funcione e apareça a textarea
    function handleStartEditor() {
        setshouldShowOnboarding(false)
    }

    // Função pra atualizar o hook no evento onchange da textarea
    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {

        // variavel de atualizar o hook no evento change e pegar o valor dela, obs: só funciona o value se colocar <HTMLTextAreaElement>
        setContent(event.target.value)

        // se estiver vazio a textarea, no caso a pessoa apagar, ela volta pra tela de escolher entre voz e texto
        if (event.target.value === '') {
            setshouldShowOnboarding(true)
        }
    }


    function handleSaveNote(event: FormEvent) {

        // preventDefault serve pra não atualizar a pagina quando da submit no form
        event.preventDefault()

        if (content === '') {
            return
        }

        onNoteCreated(content)

        setContent('')

        setshouldShowOnboarding(true)

        toast.success('Nota criada com sucesso!')

    }

    function handleStartRecording() {

        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
            || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            alert('Infelizmente seu navegador não suporta a API de gravação!')
            setIsRecording(false)
            return
        }

        setIsRecording(true)
        setshouldShowOnboarding(false)

        const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new speechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        //  maxAlternatives retorna a palavra mais proxima da que ela entendeu, defini como 1 para retornar só uma palavra
        speechRecognition.maxAlternatives = 1
        //  interim é para trazer os resultados enquanto fala , ele em false retorna só depois que termina
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.log(event)
        }

        speechRecognition.start()
    }


    function handleStopRecording() {
        setIsRecording(false)

        if(speechRecognition != null) {
            speechRecognition.stop()
        }
    }

    return (

        <Dialog.Root>
            <Dialog.Trigger className='rounded-md bg-slate-700 p-5 gap-3 flex flex-col text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-slate-200 text-sm font-medium'>Adicionar nota</span>
                <p className='text-sm leading-6 text-slate-400'>
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/60' />
                <Dialog.Content className='fixed overflow-hidden inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none'>

                    <Dialog.Close className='absolute top-0 right-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form className='flex flex-1 flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-slate-200 text-sm font-medium'>
                                Adicionar nota
                            </span>

                            {/* Condição do useState boolean, caso clique no utilize texto ele ativa a function que troca pra false e aparece a textarea  */}
                            {shouldShowOnboarding ? (
                                <p className='text-sm leading-6 text-slate-400'>
                                    Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                                </p>
                            ) : (
                                <textarea
                                    autoFocus
                                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                    onChange={handleContentChanged}
                                    value={content}
                                >
                                </textarea>
                            )}

                        </div>

                        {isRecording ? (
                            <button
                                type='button'
                                className='w-full flex items-center justify-center gap-2 bg-slate-900 text-center py-4 text-sm text-slat-300 outline-none font-medium group hover:text-slate-100'
                                onClick={handleStopRecording}
                            >
                                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                Gravando! (clique p/interromper)
                            </button>
                        ) : (
                            <button
                                type='button'
                                className='w-full bg-lime-400 text-center py-4 text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500'
                                onClick={handleSaveNote}
                            >
                                Salvar nota
                            </button>
                        )}



                    </form>


                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>



    )
}