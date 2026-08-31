export default function Home() {
  return (
    <>
      <header className="flex p-2 border-2 border-amber-500 justify-between items-center">
        <h1 className="text-2xl font-bold">AdTech Publisher Dashboard</h1>
        <div>Total Revenue Today: $0.00</div>
      </header>
      <main className="flex flex-col p-2 md:p-4 lg:p-6 gap-2 items-center mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="p-4 rounded-lg bg--50 border-2 border-amber-200 hover:shadow-lg">Ad Slot</div>
          <div className="p-4 rounded-lg bg--50 border-2 border-amber-200 hover:shadow-lg">Ad Slot</div>
          <div className="p-4 rounded-lg bg--50 border-2 border-amber-200 hover:shadow-lg">Ad Slot</div>
          <div className="p-4 rounded-lg bg--50 border-2 border-amber-200 hover:shadow-lg">Ad Slot</div>
        </div>
      </main>
    </>
  );
}
