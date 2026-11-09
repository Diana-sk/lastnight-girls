"use client";
import { useState } from "react";
import Image from "next/image";
import { Sparkles, Star, X } from "lucide-react";
import ScrollFade from "./ScrollFade";

/* Torn-paper edges, gentle jitter — neat but still handmade, like the poster */
const tornA =
  "polygon(1.5% 1%, 18% 2.5%, 34% 0.5%, 52% 2.5%, 69% 0.5%, 86% 2.5%, 98.5% 1%, 99% 22%, 97.5% 42%, 99.5% 62%, 98% 82%, 99% 98.5%, 84% 99%, 66% 97.5%, 48% 99.5%, 30% 98%, 14% 99.5%, 1.5% 98%, 0.5% 78%, 2% 58%, 0.5% 38%, 1.8% 18%)";
const tornB =
  "polygon(1% 2%, 16% 0.5%, 33% 2.2%, 50% 0.6%, 67% 2.4%, 84% 0.6%, 99% 2%, 98% 24%, 99.4% 44%, 97.6% 64%, 99.2% 84%, 98% 99%, 82% 97.6%, 64% 99.4%, 46% 97.8%, 28% 99.2%, 12% 97.6%, 1.6% 98.8%, 0.6% 76%, 2.2% 56%, 0.4% 36%, 1.6% 16%)";
const tornC =
  "polygon(2% 0.6%, 20% 2.4%, 38% 0.4%, 56% 2.4%, 74% 0.4%, 92% 2.4%, 99.4% 6%, 98% 26%, 99.6% 46%, 97.8% 66%, 99.4% 86%, 97% 98%, 78% 99.2%, 60% 97.6%, 42% 99.6%, 24% 98%, 6% 99%, 0.6% 92%, 2.2% 70%, 0.4% 50%, 2.4% 30%, 0.8% 10%)";

interface CollagePiece {
  src: string;
  alt: string;
  aspect: string;
  clip: string;
  rotate: number;
  tapeRotate: number;
  className: string;
}

const pieces: CollagePiece[] = [
  {
    src: "/images/img6.jpg",
    alt: "Праздничный стол со свечами и бокалами",
    aspect: "aspect-[3/4]",
    clip: tornA,
    rotate: -1.5,
    tapeRotate: -6,
    className: "col-span-1 lg:col-span-4",
  },
  {
    src: "/images/img4.jpg",
    alt: "Девушка зажигает свечи на праздничном столе",
    aspect: "aspect-[3/4]",
    clip: tornB,
    rotate: 1.5,
    tapeRotate: 5,
    className: "col-span-1 lg:col-span-4",
  },
  {
    src: "/images/holiday-magic.jpg",
    alt: "Девушка с бенгальским огнём у новогодней ёлки",
    aspect: "aspect-[3/4]",
    clip: tornC,
    rotate: -1,
    tapeRotate: -4,
    className: "col-span-1 lg:col-span-4",
  },
  {
    src: "/images/img3.jpg",
    alt: "Новогодние носки у камина",
    aspect: "aspect-[4/3]",
    clip: tornB,
    rotate: 1,
    tapeRotate: 6,
    className: "col-span-1 lg:col-span-5",
  },
  {
    src: "/images/img5.jpg",
    alt: "Упаковка новогодних подарков",
    aspect: "aspect-[4/3]",
    clip: tornA,
    rotate: -1.5,
    tapeRotate: -5,
    className: "col-span-1 lg:col-span-5",
  },
];

const notes = [
  { text: "свечи, бокалы, смех", rotate: -3 },
  { text: "подарок от организатора ♡", rotate: 2 },
  { text: "пледы, кино, гирлянды", rotate: -2 },
];

function Piece({
  piece,
  onOpen,
}: {
  piece: CollagePiece;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      aria-label={`Открыть фото: ${piece.alt}`}
      className={`group relative block w-full text-left cursor-pointer ${piece.className}`}
      style={{ transform: `rotate(${piece.rotate}deg)` }}
    >
      <div className="relative transition-transform duration-500 ease-out group-hover:scale-[1.03]">
        {/* cream paper backing */}
        <div
          className="absolute -inset-2 bg-[#E9E1D2] shadow-[0_14px_36px_rgba(0,0,0,0.55)]"
          style={{ clipPath: piece.clip, transform: `rotate(${piece.rotate * -0.4}deg)` }}
        />
        {/* photo */}
        <div className={`relative ${piece.aspect} w-full overflow-hidden`} style={{ clipPath: piece.clip }}>
          <Image
            src={piece.src}
            alt={piece.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 420px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
        {/* tape */}
        <div
          className="tape left-1/2 -top-3"
          style={{ transform: `translateX(-50%) rotate(${piece.tapeRotate}deg)` }}
        />
      </div>
    </button>
  );
}

export default function ConceptSection() {
  const [activePhoto, setActivePhoto] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section id="lookbook" className="relative py-24 sm:py-32 px-6 border-t border-[#C8A86B]/20 overflow-hidden">
      {/* subtle burgundy paper texture, like the poster background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <Image
          src="/images/burgundy-paper.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      {/* sparse sparkles at the edges */}
      <Sparkles className="absolute right-[4%] top-[9%] w-4 h-4 text-[#E2C889]/50 pointer-events-none animate-pulse" />
      <Star className="absolute left-[3%] top-[40%] w-3.5 h-3.5 text-[#E2C889]/40 pointer-events-none animate-pulse" style={{ animationDelay: "0.8s" }} />
      <Sparkles className="absolute right-[7%] bottom-[16%] w-3.5 h-3.5 text-[#E2C889]/45 pointer-events-none animate-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 sm:mb-16">
          <ScrollFade>
            <div className="flex items-center gap-3 mb-3">
              <span className="stamp-badge">Collage</span>
              <span className="font-script text-[#C8A86B] text-2xl">mood</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7F2]">
              Атмосфера вечера
            </h2>
          </ScrollFade>
        </div>

        {/* Collage — neat moodboard rows: 3 photos, then 2 photos + notes */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {pieces.slice(0, 4).map((piece, idx) => (
            <ScrollFade key={piece.src} delay={idx * 70} className={piece.className}>
              <Piece piece={piece} onOpen={() => setActivePhoto({ src: piece.src, alt: piece.alt })} />
            </ScrollFade>
          ))}

          {/* handwritten paper notes between the bottom photos */}
          <ScrollFade delay={300} className="col-span-1 lg:col-span-2">
            <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 py-2">
              {notes.map((note) => (
                <div
                  key={note.text}
                  className="paper-note"
                  style={{ transform: `rotate(${note.rotate}deg)`, clipPath: tornC }}
                >
                  <span className="font-script text-sm sm:text-xl whitespace-nowrap">{note.text}</span>
                </div>
              ))}
            </div>
          </ScrollFade>

          <ScrollFade delay={240} className={pieces[4].className}>
            <Piece piece={pieces[4]} onOpen={() => setActivePhoto({ src: pieces[4].src, alt: pieces[4].alt })} />
          </ScrollFade>
        </div>

        {/* Short evening description */}
        <ScrollFade>
          <p className="font-serif text-xl sm:text-2xl text-[#FAF7F2]/80 leading-relaxed max-w-2xl mx-auto text-center mt-16 sm:mt-20">
            Представь: уютная квартира в самом сердце Петербурга, за окном — снег и праздничные огни, внутри — живые
            свечи, хвоя, мандарины и звон бокалов. Мы наряжаем ёлку, прячем подарки, заворачиваемся в пледы и встречаем
            полночь так, как встречают год только с самыми близкими. Без суеты и чужих глаз — только мы, наша история и
            ночь, которую захочется пережить ещё раз.
          </p>
        </ScrollFade>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white p-2"
              aria-label="Закрыть"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="relative w-full aspect-[3/4] max-h-[85vh] rounded-2xl overflow-hidden border-2 border-[#C8A86B]/40 shadow-2xl">
              <Image src={activePhoto.src} alt={activePhoto.alt} fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
