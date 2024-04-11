interface props {
    icon: String,
    name: String
}

export default function ImgBtn({name, icon}: props) {
  return (
    <div className="flex items-center">
      <button className="btn btn-primary btn-sm rounded-full">
      <span className="text-[1.25rem] material-symbols-outlined">{icon}</span>{name}</button>
    </div>
  );
}
