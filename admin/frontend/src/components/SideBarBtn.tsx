interface Props {
    name: String,
    icon: String,
}

export default function SideBarBtn({name, icon}: Props) {
  return (
    <div className="flex flex-col items-center hover:text-black secondary-text mt-7 cursor-default">
      <span className="text-[1.45rem] material-symbols-outlined">{icon}</span>
    </div>
  );
}
