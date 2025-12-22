export default function VideoContainer() {
    return(
        <>
        <section className="w-full px-4 sm:px-8 py-10">
  {/* Sarlavha */}
  <h1 className="text-3xl sm:text-4xl font-bold text-[#2b7d78] text-center mb-8">
    Ish jarayonida lavhalar
  </h1>

  {/* Video Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Video 1 */}
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md border border-[#2b7d78]">
      <video controls className="w-full h-full object-cover">
        <source src="/videos/video1.mp4" type="video/mp4" />
        Brauzeringiz video formatini qo‘llab-quvvatlamaydi.
      </video>
    </div>

    {/* Video 2 */}
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md border border-[#2b7d78]">
      <video controls className="w-full h-full object-cover">
        <source src="/videos/video2.mp4" type="video/mp4" />
        Brauzeringiz video formatini qo‘llab-quvvatlamaydi.
      </video>
    </div>
  </div>
</section>

<section className="w-full px-4 sm:px-8 py-10">
  <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#2b7d78] mb-8">
    Tez-tez so‘raladigan savollar
  </h2>

  <div className="space-y-6 max-w-3xl mx-auto">
    {/* FAQ 1 */}
    <div className="flex items-start gap-3">
      <div className="w-3 h-3 mt-2 rounded-full bg-[#2b7d78] flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">Fixoo nima?</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          Fixoo — bu ustalar va mijozlarni birlashtiruvchi onlayn platforma bo‘lib,
          har qanday ta’mirlash, xizmat ko‘rsatish yoki texnik yordam sohalarida
          ishonchli mutaxassislarni topishga yordam beradi.
        </p>
      </div>
    </div>

    {/* FAQ 2 */}
    <div className="flex items-start gap-3">
      <div className="w-3 h-3 mt-2 rounded-full bg-[#2b7d78] flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">Ustalar platformaga qanday qo‘shiladi?</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          Ustalar oddiy ro‘yxatdan o‘tish orqali platformada o‘z profilini yaratadi
          va xizmatlarini joylashtiradi. Har bir profil tekshiruvdan o‘tadi.
        </p>
      </div>
    </div>

    {/* FAQ 3 */}
    <div className="flex items-start gap-3">
      <div className="w-3 h-3 mt-2 rounded-full bg-[#2b7d78] flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">Fixoo xizmatlari bepulmi?</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          Platformadan foydalanish bepul. Faqatgina ustalar uchun premium xizmatlar
          yoki targ‘ibot variantlari pullik bo‘lishi mumkin.
        </p>
      </div>
    </div>

    {/* FAQ 4 */}
    <div className="flex items-start gap-3">
      <div className="w-3 h-3 mt-2 rounded-full bg-[#2b7d78] flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">Buyurtma berganimdan keyin nima bo‘ladi?</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          Siz tanlagan usta siz bilan bog‘lanadi va xizmat ko‘rsatish shartlari bo‘yicha
          kelishuv amalga oshadi. Barcha aloqa platforma ichida amalga oshiriladi.
        </p>
      </div>
    </div>
  </div>
</section>

        </>
    )
}