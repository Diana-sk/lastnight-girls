"use client";
import Image from "next/image";
import ScrollFade from "./ScrollFade";

export default function DressCodeSection() {
  const styles = [
    {
      title: "Dark Velvet & Corsetry",
      desc: "Бархат глубоких винных и тёмно-красных оттенков, шёлк, атлас, корсеты и струящиеся силуэты.",
    },
    {
      title: "Holiday Sparkle & Shine",
      desc: "Всё, что сияет в свете свечей: пайетки, металлик, мерцающие ткани и роскошный праздничный блеск.",
    },
    {
      title: "Vintage Chic & Accessories",
      desc: "Жемчужные нити, оперные перчатки, атласные банты, акцентные туфли и украшения с историей.",
    },
  ];

  return (
    <section id="manifesto" className="relative py-28 sm:py-36 px-6 overflow-hidden border-t border-[#C8A86B]/20">
      {/* Subtle crumpled burgundy paper texture in background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Image
          src="/images/burgundy-paper.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
        <ScrollFade>
          <div className="inline-flex items-center gap-2">
            <span className="stamp-badge">
              Дресс-код мероприятия
            </span>
          </div>
        </ScrollFade>

        <ScrollFade delay={100}>
          <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-normal text-[#FAF7F2] leading-[1.15]">
            «То, что хотелось надеть в этом году, но не выдалось случая»
          </h2>
        </ScrollFade>

        <ScrollFade delay={200}>
          <p className="font-serif text-xl sm:text-2xl text-[#FAF7F2]/80 max-w-2xl mx-auto leading-relaxed">
            Главный закон ночи: никаких скучных рамок. Достань то самое платье, в котором ты чувствуешь себя ослепительно: бархат винных оттенков, корсеты, струящийся шёлк, сверкающие пайетки, оперные перчатки или любимые туфли на каблуке.
          </p>
        </ScrollFade>

        {/* 3 Directions as Editorial Notes */}
        <ScrollFade delay={300}>
          <div className="grid md:grid-cols-3 gap-6 pt-4 text-left">
            {styles.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-[#C8A86B]/25 bg-[#140F11]/80 backdrop-blur-sm"
              >
                <div className="text-xs font-mono text-[#C8A86B] mb-2">0{idx + 1}</div>
                <div className="font-display text-lg font-bold text-[#FAF7F2] mb-1.5">{item.title}</div>
                <div className="font-serif text-sm text-[#FAF7F2]/70 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </ScrollFade>

        <ScrollFade delay={400}>
          <div className="pt-6">
            <span className="font-brush text-3xl sm:text-4xl text-[#C8A86B] drop-shadow-md inline-block">
              «В этот вечер можно всё. Почти.»
            </span>
            <p className="text-xs text-white/45 tracking-widest uppercase mt-3">
              Если сомневаешься в деталях — организатор с радостью поможет определиться с образом
            </p>
          </div>
        </ScrollFade>
      </div>
    </section>
  );
}
