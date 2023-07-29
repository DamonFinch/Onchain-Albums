import { motion } from 'framer-motion'

const Description = ({ controls, className }) => {
  const variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  }

  return (
    <motion.div
      className={`flex flex-col gap-3 text-xs md:text-lg text-[#898CA9] md:font-body text-center ${className}`}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      <motion.div>Sign in to view your albums.</motion.div>
    </motion.div>
  )
}

export default Description
