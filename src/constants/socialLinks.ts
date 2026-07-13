import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

export const socialLinks = [
    {
        name: 'Facebook',
        href: '#',
        icon: FaFacebookF,
        iconClass: 'text-[#1877F2]',
        glowClass: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/20',
    },
    {
        name: 'Instagram',
        href: '#',
        icon: FaInstagram,
        iconClass: 'text-[#E4405F]',
        glowClass: 'from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/20',
    },
    {
        name: 'LinkedIn',
        href: '#',
        icon: FaLinkedinIn,
        iconClass: 'text-[#0A66C2]',
        glowClass: 'from-cyan-100 to-sky-100 dark:from-cyan-900/30 dark:to-sky-900/20',
    },
    {
        name: 'X',
        href: '#',
        icon: FaXTwitter,
        iconClass: 'text-slate-900 dark:text-slate-100',
        glowClass: 'from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800',
    },
]
