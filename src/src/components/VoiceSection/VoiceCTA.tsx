'use client';

import { motion } from 'framer-motion';

const VoiceCTA = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            나라똔과 함께 성장하세요
          </h2>
          <p className="text-base md:text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            수많은 사업자님들이 나라똔과 함께 성공적인 비즈니스를 운영하고 있습니다.
            <br className="hidden md:block" />
            지금 바로 시작하세요!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
            >
              무료 체험 시작하기
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-blue-600 transition-all w-full sm:w-auto"
            >
              리뷰 작성하기
            </motion.button>
          </div>

          {/* 추가 정보 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="text-3xl md:text-4xl mb-2">🎁</div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">첫 달 무료</h3>
              <p className="text-xs md:text-sm opacity-80">신규 가입 시 첫 달 무료 이용</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="text-3xl md:text-4xl mb-2">💡</div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">무료 컨설팅</h3>
              <p className="text-xs md:text-sm opacity-80">전문가의 1:1 맞춤 컨설팅</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="text-3xl md:text-4xl mb-2">🚀</div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">즉시 시작</h3>
              <p className="text-xs md:text-sm opacity-80">5분 만에 설정 완료</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VoiceCTA;
