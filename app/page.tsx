import Card from "@/components/card";
import { mockAdSlots } from "@/lib/mock-ad-slots";

export default function Home() {
  return (
    <>
      <header className="flex p-2 border-2 border-amber-500 justify-between items-center">
        <h1 className="text-2xl font-bold">AdTech Publisher Dashboard</h1>
        <div>Total Revenue Today: $0.00</div>
      </header>

      <main className="flex flex-col p-2 md:p-4 lg:p-6 gap-2 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 w-full">
          {/* Add your ad slots here */}
          {
            mockAdSlots.map((adSlot) => (
              <div className="@container" key={adSlot.id}>
                <Card key={adSlot.id} adSlot={adSlot} />
              </div>
            ))
          }
        </div>
      </main>
    </>
  );
}
