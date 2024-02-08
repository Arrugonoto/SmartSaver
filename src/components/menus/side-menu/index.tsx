import Link from 'next/link';

export const SideMenu = () => {
   return (
      <div className="flex flex-col min-w-[240px]">
         <nav className="p-4">
            <ul>
               <li>
                  <Link
                     href="/dashboard"
                     className="flex p-2 rounded-md hover:bg-gray-600/50"
                  >
                     Overview
                  </Link>
               </li>
               <li>
                  <Link
                     href="/expenses"
                     className="flex p-2 rounded-md hover:bg-gray-600/50"
                  >
                     Expenses
                  </Link>
               </li>
            </ul>
         </nav>
      </div>
   );
};
