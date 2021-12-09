export function Lockup() {
  return (
    <div className="grid grid-cols-2 grid-rows-[4.5rem_auto_min(1fr,4.5rem)]">
      <div className="col-start-1 row-start-2 row-end-4">
        <div className="w-full h-[200px] bg-blue-500" />
        <div className="h-[4.5rem]" />
      </div>
      <div className="col-start-2 row-start-1 row-end-3">
        <div className="h-[500px] bg-red-500"></div>
        {/* <div className="h-[4.5rem]" /> */}
      </div>
    </div>
    // <div className="flex">
    //   <div className="w-1/2 flex-none flex flex-col">
    //     <div className="h-[4.5rem] flex-none" />
    //     <div className="flex-auto flex items-center">
    //       <div className="bg-blue-500 w-full h-[500px]" />
    //     </div>
    //     <div className="h-[4.5rem] flex-shrink" />
    //   </div>
    //   <div className="w-1/2 flex-none ">
    //     <div className="bg-red-500 h-[400px]" />
    //   </div>
    // </div>
  )
}
