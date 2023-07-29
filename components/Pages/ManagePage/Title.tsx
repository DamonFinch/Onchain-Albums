import { motion } from 'framer-motion'

const Title = ({ controls }) => {
  const variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25 },
    },
  }

  return (
    <motion.div
      className="flex flex-col gap-1 md:gap-3 text-white font-hanson text-lg md:text-5xl text-center"
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      <motion.div>Select an Album</motion.div>
      <motion.div>to Manage</motion.div>
    </motion.div>
  )
}

export default Title
