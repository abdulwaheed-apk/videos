// import React, { useState, useMemo, ReactNode } from "react";
// import { ArrowDown, ArrowUp, Zap } from "lucide-react";

// // --- Mock Data Generation ---
// const generateData = (count: number) => {
//   const statuses = ["Paid", "Pending", "Failed", "Processing"];
//   const methods = ["Credit Card", "Bank Transfer", "PayPal", "Wire"];
//   return Array.from({ length: count }, (_, i) => ({
//     id: `INV${1000 + i}`,
//     invoice: `#${(10000 + i).toString().padStart(5, "0")}`,
//     paymentStatus: statuses[i % statuses.length],
//     totalAmount: `$${(Math.random() * 1000 + 50).toFixed(2)}`,
//     paymentMethod: methods[i % methods.length],
//     date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
//   }));
// };

// const initialData = generateData(15); // Generate 15 rows as requested

// type Props = {
//   children: ReactNode;
//   className?: string;
// };
// // --- Utility Components (Simulating Shadcn/Tailwind Structure) ---

// // Base Card Container
// const Card = ({ children, className = "" }: Props) => (
//   <div
//     className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
//   >
//     {children}
//   </div>
// );

// // Table Cell/Header Styling
// const THeadCell = ({ children, className = "" }: Props) => (
//   <th
//     className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
//   >
//     {children}
//   </th>
// );

// const TBodyCell = ({ children, className = "" }: Props) => (
//   <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
//     {children}
//   </td>
// );

// // --- Main App Component ---

// const App = () => {
//   // State for sorting (optional feature)
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const sortedData = useMemo(() => {
//     const sortableItems = [...initialData];
//     if (sortConfig.key !== null) {
//       sortableItems.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [initialData, sortConfig]);

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   // Custom Status Badge
//   const StatusBadge = ({ status }) => {
//     let color = "";
//     switch (status) {
//       case "Paid":
//         color = "bg-green-100 text-green-700";
//         break;
//       case "Pending":
//         color = "bg-yellow-100 text-yellow-700";
//         break;
//       case "Failed":
//         color = "bg-red-100 text-red-700";
//         break;
//       case "Processing":
//         color = "bg-blue-100 text-blue-700";
//         break;
//       default:
//         color = "bg-gray-100 text-gray-700";
//     }
//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
//       >
//         <Zap className="w-3 h-3 mr-1" />
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
//       <div className="w-full max-w-4xl">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//           Invoices Dashboard
//         </h1>

//         <Card className="overflow-hidden">
//           <div className="text-sm font-semibold text-gray-600 mb-4">
//             Total Records: {initialData.length}. Only ~5 rows are visible before
//             scrolling.
//           </div>

//           {/*
//             THE KEY CONTAINER:
//             - max-h-[300px]: This sets a maximum height (approx 5-6 rows).
//             - overflow-y-auto: This enables vertical scrolling when content exceeds the max height.
//             - relative: Needed for the sticky positioning to work correctly within this block.
//           */}
//           <div className="max-h-[300px] overflow-y-auto relative rounded-lg border">
//             <table className="w-full caption-bottom text-sm border-collapse">
//               {/*
//                 THE STICKY HEADER:
//                 - sticky: Positions the header relative to the scrolling container.
//                 - top-0: Ensures it sticks to the top of the container.
//                 - bg-white: Crucial for making sure the scrolling rows don't show through the header.
//                 - z-10: Ensures the header is above the scrolling content.
//               */}
//               <thead className="sticky top-0 z-10 bg-white shadow-sm border-b">
//                 <tr className="border-b transition-colors hover:bg-gray-50">
//                   {["Invoice", "Status", "Method", "Date", "Total"].map(
//                     (header, index) => {
//                       const key = [
//                         "invoice",
//                         "paymentStatus",
//                         "paymentMethod",
//                         "date",
//                         "totalAmount",
//                       ][index];
//                       return (
//                         <THeadCell key={key}>
//                           <button
//                             onClick={() => requestSort(key)}
//                             className="flex items-center text-left hover:text-gray-700 transition"
//                           >
//                             {header}
//                             {sortConfig.key === key &&
//                               (sortConfig.direction === "ascending" ? (
//                                 <ArrowUp className="w-4 h-4 ml-1" />
//                               ) : (
//                                 <ArrowDown className="w-4 h-4 ml-1" />
//                               ))}
//                           </button>
//                         </THeadCell>
//                       );
//                     },
//                   )}
//                 </tr>
//               </thead>

//               {/* The table body will scroll naturally */}
//               <tbody className="[&_tr:last-child]:border-0">
//                 {sortedData.map((item) => (
//                   <tr
//                     key={item.id}
//                     className="border-b transition-colors hover:bg-gray-50"
//                   >
//                     <TBodyCell className="font-medium text-gray-900">
//                       {item.invoice}
//                     </TBodyCell>
//                     <TBodyCell>
//                       <StatusBadge status={item.paymentStatus} />
//                     </TBodyCell>
//                     <TBodyCell>{item.paymentMethod}</TBodyCell>
//                     <TBodyCell className="text-gray-500">{item.date}</TBodyCell>
//                     <TBodyCell className="text-right font-semibold text-gray-900">
//                       {item.totalAmount}
//                     </TBodyCell>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* If data is empty, display a message */}
//             {sortedData.length === 0 && (
//               <div className="text-center p-8 text-gray-500">
//                 No records found.
//               </div>
//             )}
//           </div>
//         </Card>

//         <p className="mt-8 text-sm text-gray-500">
//           *The fixed height of the table body (max-h-[300px]) allows only the
//           rows to scroll while the header remains locked at the top, achieving
//           the sticky effect.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default App;
