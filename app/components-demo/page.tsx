import Badge from "@/components/badge";
import MyButton, { INTENTS, SIZES } from "@/components/mybutton";

export default function Home() {
  return (
    <>
      <header className="flex p-2 border-2 border-amber-500 justify-between items-center">
        <h1 className="text-2xl font-bold">AdTech Publisher Demo</h1>
      </header>
      <Badge text="Winning" intent="winning" />
      <Badge text="No Fill" intent="nofill" />

      <div className="flex flex-col gap-4 p-6">
        {INTENTS.map((intent) => (
          <div key={intent} className="flex items-center gap-2">
            {SIZES.map((size) => (
              <MyButton key={size} intent={intent} size={size}>
                {intent} / {size}
              </MyButton>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
