const Button = ({ text, icon, img, style, type, onClick }) => {
	return (
		<button className={`flex items-center gap-2 px-3 py-2 rounded-sm active:bg-blue-900 hover:bg-blue-700 ${style}`}
			type={type}
			onClick={onClick}
		>
			{img && <img src={img} alt="" className="h-6 rounded-full" />}
			{icon && icon}
			{text && text}
		</button>
	)
}

export default Button