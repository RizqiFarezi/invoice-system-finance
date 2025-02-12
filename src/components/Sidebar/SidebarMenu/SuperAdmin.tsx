import Dashboard from "./component/Dashboard";
import ListUser from "./component/ListUser";
import AddUser from "./component/AddUser";

export const SuperAdmin = () => {
    console.log("Rendering SuperAdmin Menu");
    return (
        <div>
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black-2 dark:text-bodydark2">
                    ADMIN MENU
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                    <Dashboard />
                    <ListUser />
                    <AddUser />
                </ul>
            </div>
        </div>
    );
};
