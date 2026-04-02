import { UserSearchResult } from "@/models/users/user";
import Avatar from "./avatar";

type Props = {
  users: UserSearchResult[];
  onAddFriend: (id: number) => void;
  onChooseUser:(id:number) => void;
};

export default function UserSearchItem({ users, onAddFriend , onChooseUser }: Props) {
    
  return (
    <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 scrollbar-thin">
      {users.length === 0 && (
        <p className="text-center text-slate-600 text-xs py-8">
          Không tìm thấy người dùng
        </p>
      )}

      {users.map((user) => (
        <div key={user.id} className="relative">
          <button
           onClick={()=>onChooseUser(user.id)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group hover:bg-white/[0.04] border border-transparent"
          >
            <Avatar
              name={user.displayName}
              id={user.id}
              showStatus
              status={user.status}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate text-slate-200">
                  {user.displayName}
                </span>
              </div>
            </div>
          </button>

          <button
            className="absolute right-2 top-2 bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600"
            onClick={() => onAddFriend(user.id)}
          >
            Kết bạn
          </button>
        </div>
      ))}
    </div>
  );
}