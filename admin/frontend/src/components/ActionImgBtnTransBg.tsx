interface Props {
    icon: String,
}

export default function ActionImgBtnTransBg({icon}: Props) {
  return (
    <div className="flex flex-col items-center hover:text-black secondary-text cursor-default">
      <span className="text-[1.25rem] material-symbols-outlined">{icon}</span>
    </div>
  );
}
