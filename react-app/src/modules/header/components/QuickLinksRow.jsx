export default function QuickLinksRow({ name, icon, isFirst, isLast }) {
  const radiusClass = isFirst ? 'rounded-t-md' : isLast ? 'rounded-b-md' : 'rounded-none'
  return (
    <div
      className={`grid grid-cols-[32px_minmax(0,1fr)_32px_32px_32px_32px] items-center gap-2 p-2 border ${radiusClass}`}
    >
      <span className="material-symbols-outlined justify-self-center" aria-hidden>
        {icon}
      </span>

      <p className="m-0 truncate">{name}</p>

      <button className="justify-self-center text-slate-600">
        <span className="material-symbols-outlined" aria-hidden>
          arrow_upward
        </span>
      </button>
      <button className="justify-self-center text-slate-600">
        <span className="material-symbols-outlined" aria-hidden>
          arrow_downward
        </span>
      </button>
      <button className="justify-self-center text-slate-600">
        <span className="material-symbols-outlined" aria-hidden>
          edit
        </span>
      </button>
      <button className="justify-self-center text-red-500">
        <span className="material-symbols-outlined" aria-hidden>
          delete
        </span>
      </button>
    </div>
  )
}
