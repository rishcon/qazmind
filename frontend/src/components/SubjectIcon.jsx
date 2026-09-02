function Icon({ children, className }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
}

export default function SubjectIcon({ name, className = 'h-5 w-5' }) {
  const subject = (name || '').toLowerCase()
  let paths = <><path d="M5 5.5h14v13H5z" /><path d="M8 9h8M8 13h5" /></>
  if (subject.includes('математическ')) paths = <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h3m2 0h3M8 16h8" /></>
  else if (subject.includes('математика')) paths = <><path d="M5 18 18 5" /><path d="M6 6h12v12" /><circle cx="6" cy="18" r="1.5" /></>
  else if (subject.includes('чтения') || subject.includes('литератур')) paths = <path d="M4 5.5C7 4.2 9.7 4.7 12 7v12c-2.3-2.3-5-2.8-8-1.5zM20 5.5C17 4.2 14.3 4.7 12 7v12c2.3-2.3 5-2.8 8-1.5z" />
  else if (subject.includes('физика')) paths = <><ellipse cx="12" cy="12" rx="8" ry="3.5" /><ellipse cx="12" cy="12" rx="8" ry="3.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="8" ry="3.5" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /></>
  else if (subject.includes('биология')) paths = <><path d="M19 5C11 5 6 8.5 6 15c0 2.2 1.8 4 4 4 6.5 0 9-6 9-14Z" /><path d="M5 20c3.5-4.5 6.5-7 11-9" /></>
  else if (subject.includes('химия')) paths = <><path d="M9 4h6M10 4v6l-4.2 7.2A2 2 0 0 0 7.5 20h9a2 2 0 0 0 1.7-2.8L14 10V4" /><path d="M8.5 15h7" /></>
  else if (subject.includes('англий') || subject.includes('иностран')) paths = <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" /></>
  else if (subject.includes('всемир')) paths = <><circle cx="12" cy="12" r="8" /><path d="M4.7 9h14.6M4.7 15h14.6M12 4c2 2.1 3 4.8 3 8s-1 5.9-3 8c-2-2.1-3-4.8-3-8s1-5.9 3-8Z" /></>
  else if (subject.includes('географ')) paths = <><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2z" /><path d="M9 4v14M15 6v14" /></>
  else if (subject.includes('қазақ')) paths = <><path d="M5 5h14v10H9l-4 4z" /><path d="M9 9h6M9 12h4" /></>
  else if (subject.includes('история')) paths = <><path d="M5 5.5h14v13H5z" /><path d="M8 9h8M8 13h5" /><path d="M8 18.5h8" /></>
  return <Icon className={className}>{paths}</Icon>
}
