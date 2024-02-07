export function NoteCard() {
    return (
        <button className='rounded-md outline-none text-left bg-slate-800 p-5 space-y-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
            <span className='text-slate-200 text-sm font-medium'>há 2 dias</span>
            <p className='text-sm leading-6 text-slate-300'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, quos dolores. Optio nulla unde, doloribus qui eaque nam possimus rerum tempore, ut iusto, atque suscipit? Perferendis cum porro illum odit.Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, quos dolores. Optio nulla unde, doloribus qui eaque nam possimus rerum tempore, ut iusto, atque suscipit? Perferendis cum porro illum odit.
            </p>

            <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
        </button>
    )
}