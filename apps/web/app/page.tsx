import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-serif selection:bg-[#DEB887]/30 flex flex-col">
      <Header />

      {/* Small space after header */}
      <div className="h-6 md:h-8"></div>

      {/* 2. HERO */}
      <div className="flex flex-col items-center text-center px-5 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-center gap-4 text-[#8B4513] font-bold mb-6 tracking-widest text-lg w-full max-w-md">
          <span className="flex-1 h-px bg-[#8B4513]"></span>
          वेदाङ्ग ज्योतिष
          <span className="flex-1 h-px bg-[#8B4513]"></span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-8 text-[#3E2723] max-w-4xl">
          The Eye of the <span className="text-[#8B4513]">Vedas</span>
        </h1>

        <p className="text-lg md:text-xl leading-relaxed text-[#5D4037] mb-12 max-w-3xl">
          Jyotish is one of the six Vedangas and is traditionally known as
          the Eye of the Vedas. It studies the manifestation of Karma
          through Grahas, Rashis, Nakshatras, Dashas and Divisional Charts.
        </p>

        {/* Image + Quote */}
        <div className="w-full max-w-[110px] md:max-w-[130px] lg:max-w-[150px] mx-auto mb-16 px-4 mt-2">
          <div className="relative">
            <div className="border-[6px] md:border-[8px] border-[#FFFDF8] outline outline-1 outline-[#DEB887] rounded-t-full rounded-b-3xl shadow-2xl overflow-hidden">
              <Image
                src="/parashara.jpg"
                alt="Maharishi Parashara"
                width={150}
                height={150}
                className="w-full h-auto object-cover sepia-[0.35] hover:sepia-0 transition-all duration-700"
              />
            </div>

            <blockquote className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[240%] max-w-[320px] bg-[#FFFDF8] border border-[#DEB887] rounded-2xl shadow-xl p-4 md:p-6 text-center z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FDFBF7] px-5 text-[#8B4513] text-3xl">
                ✧
              </div>
              <div className="text-xl md:text-2xl font-bold text-[#8B4513] leading-relaxed mb-2">
                &quot;कर्म-फल-विपाक-काल-विधानम्&quot;
              </div>
              <div className="text-sm md:text-base italic text-[#5D4037] font-medium">
                The science of understanding the timing of karmic results.
              </div>
            </blockquote>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link
            href="/chart/create"
            className="flex items-center justify-center bg-gradient-to-br from-[#8B4513] to-[#5D4037] text-[#FFFDF8] px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Create Birth Chart
          </Link>

          <a
            href="#parashara"
            className="flex items-center justify-center border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-[#FFFDF8] px-8 py-4 rounded-xl text-lg font-bold transition-all"
          >
            Learn Jyotish
          </a>
        </div>
      </div>

      {/* Small space */}
      <div className="h-8 md:h-12"></div>

      {/* 3. CREATE KUNDLI BUTTON */}
      <div className="flex justify-center -mt-6 mb-16 px-5">
        <Link
          href="/chart/create"
          className="flex items-center gap-3 bg-gradient-to-br from-[#8B4513] to-[#5D4037] hover:from-[#5D4037] hover:to-[#3E2723] text-white px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-semibold text-lg tracking-wide"
        >
          ॐ Create Your Kundli Now
        </Link>
      </div>

      {/* Small space */}
      <div className="h-6"></div>

      {/* 4. PARASHARA */}
      <div id="parashara" className="bg-[#FFFDF8] border-y border-[#DEB887]/40 py-12">
        <div className="flex flex-col items-center text-center px-5">
          <div className="text-[#8B4513] text-4xl mb-6">❖</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[#3E2723]">
            Maharishi Parashara
          </h2>

          <div className="space-y-6 text-[17px] leading-relaxed text-[#5D4037] max-w-3xl">
            <p>Brihat Parashara Hora Shastra is regarded as the foundational scripture of predictive Vedic Astrology.</p>
            <p>This application follows Parashari principles and Swiss Ephemeris calculations to generate accurate Vedic birth charts, Panchanga, Dashas, Yogas and Divisional Charts.</p>
          </div>
        </div>
      </div>

      {/* Small space */}
      <div className="h-8 md:h-12"></div>

      {/* 5. WHAT IS JYOTISH */}
      <div className="py-12 px-5 flex flex-col items-center justify-center w-full">
        <div className="w-full flex justify-center items-center gap-4 mb-12 mx-auto">
          <div className="h-px bg-[#DEB887] flex-1 max-w-[140px]"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] text-center px-6">
            What is Jyotish?
          </h2>
          <div className="h-px bg-[#DEB887] flex-1 max-w-[140px]"></div>
        </div>
        <div className="w-full max-w-4xl mx-auto space-y-8 text-[17px] leading-relaxed text-[#5D4037] text-center flex flex-col items-center justify-center">
          <p>Jyotish studies the timing of Karma and its manifestation through celestial movements. It is not merely prediction, but a framework for understanding Dharma, Artha, Kama and Moksha.</p>
          <p>The system uses Grahas, Rashis, Nakshatras, Panchanga, Dashas and Varga charts to understand the karmic blueprint of an individual.</p>
          <p>The Moon, Nakshatras and Vimshottari Dasha form the foundation of predictive astrology according to the Parashari tradition.</p>
        </div>
      </div>

      {/* Small space */}
      <div className="h-8 md:h-12"></div>

      {/* 6. FEATURES */}
      <div className="bg-[#FFFDF8] border-y border-[#DEB887]/40 relative overflow-hidden py-12 flex flex-col items-center justify-center w-full">
        <div className="absolute inset-0 bg-[radial-gradient(#DEB887_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />

        <div className="w-full max-w-6xl mx-auto px-5 relative z-10">
          <div className="text-center mb-16">
            <div className="text-[#8B4513] text-4xl mb-4">📜</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723]">
              Explore Your Horoscope
            </h2>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center mx-auto">
            {[
              "Birth Chart (D1)", "Navamsa (D9)", "Shodashavarga",
              "Vimshottari Dasha", "Panchanga", "Transit Analysis",
              "Yogas", "Doshas", "Detailed Reports"
            ].map((item) => (
              <div
                key={item}
                className="group w-full max-w-sm p-8 rounded-2xl border border-[#DEB887]/60 bg-[#FDFBF7] hover:border-[#8B4513]/40 hover:shadow-md hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="text-3xl text-[#DEB887] group-hover:text-[#8B4513] transition-colors mb-4">✦</div>
                <h3 className="font-bold text-xl text-[#5D4037] group-hover:text-[#3E2723] transition-colors">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <Footer />
    </main>
  );
}