import { useState } from 'react'
import Song from '../Song'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Mousewheel, Pagination } from 'swiper/modules'
import PendingTxModal from '@components/PendingTxModal'
import useIsMobile from '@hooks/useIsMobile'
import Spinner from '@components/Spinner'
import { motion, AnimatePresence } from 'framer-motion'
import 'swiper/css/bundle' // import Swiper styles
import useWalletNfts from '@hooks/useWalletNfts'

const SongList = ({ className }: any) => {
  const [open, setOpen] = useState(false)
  const { isMobile } = useIsMobile()
  const { walletNfts } = useWalletNfts()

  return (
    <div className={`w-full flex justify-center ${className}`}>
      {/* @ts-ignore */}
      <AnimatePresence exitBeforeEnter>
        {walletNfts.length > 0 ? (
          <motion.div
            key="swiper"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <Swiper
              //  @ts-ignore
              effect="coverflow"
              grabCursor={true}
              mousewheel={true}
              centeredSlides={true}
              slidesPerView={isMobile ? 3 : 5}
              spaceBetween={10}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={false}
              modules={[Mousewheel, EffectCoverflow, Pagination]}
            >
              {walletNfts.map((song) => (
                <SwiperSlide key={song.title}>
                  <Song
                    song={song}
                    onRegistering={() => setOpen(true)}
                    onError={() => setOpen(false)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ) : (
          <motion.div
            key="spinner"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Spinner size={isMobile ? 155 : 280} />
          </motion.div>
        )}
      </AnimatePresence>
      {open && <PendingTxModal />}
    </div>
  )
}

export default SongList
