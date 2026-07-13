import PageBanner from '../../../components/ui/PageBanner'
import ContactForm from './ContactForm'
import { contactChannels } from '../../../constants/contactArea'
import {
    socialLinks

} from '../../../constants/socialLinks'
const Contact = () => {
    return (
        <>
            <PageBanner
                pageTitle='Contact Us'
                pageSubTitle='We would love to hear from you.'
            />
            <section className='pt-12'>
                <div className='mx-auto max-w-7xl px-6'>
                    <h2 className='text-2xl lg:text-3xl text-center font-bold'>Get in touch with us</h2>
                    <p className='mt-2 text-center text-slate-600 dark:text-slate-300'>We'd love to hear from you.</p>

                    <div className='mt-10 grid grid-cols-1 xs:grid-cols-2 gap-6 lg:grid-cols-4'>
                        {contactChannels.map((channel) => {
                            const Icon = channel.icon

                            return (
                                <div
                                    key={channel.title}
                                    className='flex items-start gap-4 rounded-2xl border border-slate-100 shadow-sm bg-white p-5 dark:border-slate-700 dark:bg-slate-800'
                                >
                                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-700'>
                                        <Icon size={24} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {channel.title}
                                        </h3>

                                        {channel.href ? (
                                            <>
                                                <a
                                                    href={channel.href}
                                                    className="mt-1 inline-block text-sm leading-6 text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    {channel.description}
                                                </a>

                                                {channel.subDescription && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {channel.subDescription}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                    {channel.description}
                                                </p>

                                                {channel.subDescription && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {channel.subDescription}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="mx-auto max-w-5xl pt-10 px-6">
                    <h2 className="text-center text-xl font-bold md:text-2xl">
                        Connect with us
                    </h2>
                    <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300">
                        Find us where conversations happen.
                    </p>

                    <div className="mt-5 flex justify-center gap-1">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                aria-label={`Visit our ${social.name} page`}
                                className="group flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                            >
                                <social.icon
                                    className={`text-[20px] transition-transform duration-200 group-hover:scale-125 ${social.iconClass}`}
                                />
                                <span className="sr-only">{social.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <ContactForm />
                </div>
            </section>

        </>
    )
}

export default Contact