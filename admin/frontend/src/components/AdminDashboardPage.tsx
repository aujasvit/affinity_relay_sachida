import ImgBtn from "./ImgBtn";

export default function AdminDashboardPage() {
  return (
    <div className="w-full h-full px-5 py-5">
      <div className="flex w-full justify-between items-center">
        <span className="text-black font-semibold text-lg">Relay Dashboard</span>
        
        <div>
            <span className="text-sm">nostr_ts_relay</span>
            <span className="text-[1.25rem] material-symbols-outlined">
              outbound
            </span>
          </div>
          
      </div>
      <div>
        <div className="mt-12 text-xs">
      // TODO: Create a Dashboard, later</div>
      </div>
    </div>
  );
}
