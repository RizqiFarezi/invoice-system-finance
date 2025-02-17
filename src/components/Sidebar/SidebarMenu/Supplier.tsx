import Dashboard from "./component/Dashboard3";
import GRTracking from "./component/GRTracking3";
import InvoiceCreation from "./component/InvoiceCreation3";
import InvoiceReport from "./component/InvoiceReport3";

export const Supplier = () => {

    return (
        <div>
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black-2  dark:text-bodydark2">
                    SUPPLIER MENU
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                    {/* <!-- Menu Item Dashboard --> */}            
                    <Dashboard />
                    {/* <!-- Menu Item Dashboard --> */}
                    <li>
                    <GRTracking />
                    </li>
                    <li>
                    <InvoiceCreation />
                    </li>
                    <li>
                    <InvoiceReport />
                    </li>
                </ul>
            </div>
        </div>
    );
}