function Card({ children, className = "" }) {
  return (
    <div
     className={`
    bg-white
    rounded-2xl
    shadow-md
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
    border
    border-gray-100
    p-6
    ${className}
`}
    >
      {children}
    </div>
  );
}

export default Card;