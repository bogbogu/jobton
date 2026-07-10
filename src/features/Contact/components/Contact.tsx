import PageBanner from '../../../components/ui/PageBanner'
import ContactForm from './ContactForm'

const Contact = () => {
    return (
        <>
            <PageBanner
                pageTitle='Contact Us'
                pageSubTitle='We would love to hear from you.'
            />
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <ContactForm />
                </div>
            </section>

        </>
    )
}

export default Contact