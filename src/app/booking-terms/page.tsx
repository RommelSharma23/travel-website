// File: app/booking-terms/page.tsx

import React from 'react';
import {  Shield, FileText, AlertCircle, Phone, Mail, MapPin, Users, CreditCard, Globe, Clock, AlertTriangle, Scale } from 'lucide-react';

// Dynamic Configuration - Update these values as needed
const COMPANY_CONFIG = {
  companyName: "GetAway Vibe",
  tagline: "Your Vibe Your Journey Your Getaway",
  currency: "INR",
  depositPercentage: 30,
  finalPaymentDays: 21,
  //minInsuranceCoverage: "$100,000 USD",
  passportValidityMonths: 6,
  complaintResponseDays: 14,
  complaintDeadlineDays: 30,
  
  // Contact Information
  contact: {
    email: "info@getawayvibe.com",
    bookingEmail: "bookings@getawayvibe.com",
    emergencyEmail: "support@getawayvibe.com",
    phone: "+91 7877995497",
    emergencyPhone: "+91 7877995497",
    address: "Jaipur, Rajasthan, India",
    website: "www.getawayvibe.com"
  },
  
  // Payment Methods
  paymentMethods: ["Bank Transfer", "UPI", "Credit Cards", "Debit Cards"],
  
  // Legal Information
  legal: {
    governingLaw: "India",
    jurisdiction: "Rajasthan Courts",
    lastUpdated: "January 2025"
  }
};

const BookingTermsPage = () => {
  const sections = [
    {
      id: 'general',
      title: '1.1 General Terms',
      icon: <FileText className="w-5 h-5" />,
      subsections: [
        {
          title: '1.1.1 Agreement Formation',
          content: `These Booking Terms and Conditions ("Terms") govern all travel bookings made through ${COMPANY_CONFIG.companyName} ("Company," "we," "us," or "our"). By submitting an inquiry or booking request, you ("Customer," "you," or "your") agree to be bound by these Terms.`
        },
        {
          title: '1.1.2 Booking Process',
          content: 'Our booking process is inquiry-based. All travel arrangements are subject to availability and confirmation. A booking is not confirmed until: You receive written confirmation from us, Any required deposits are paid, and All necessary documentation is provided.'
        },
        {
          title: '1.1.3 Travel Arrangements',
          content: 'We act as an intermediary between you and various travel service providers including but not limited to hotels, airlines, transport companies, and local tour operators. We are not responsible for the acts, omissions, or defaults of these third parties.'
        }
      ]
    },
    {
      id: 'pricing',
      title: '1.2 Pricing and Payment',
      icon: <CreditCard className="w-5 h-5" />,
      subsections: [
        {
          title: '1.2.1 Package Pricing',
          content: `All prices are quoted in ${COMPANY_CONFIG.currency} unless otherwise specified in your booking confirmation. Prices are subject to change until booking is confirmed with deposit. Group pricing may vary based on final participant numbers. Prices include services specifically mentioned in your itinerary.`
        },
        {
          title: '1.2.2 Payment Schedule',
          content: `Deposit: ${COMPANY_CONFIG.depositPercentage}% of total package cost due upon booking confirmation. Final payment: Due ${COMPANY_CONFIG.finalPaymentDays} days before travel commencement. Payment methods accepted: ${COMPANY_CONFIG.paymentMethods.join(', ')}. Late payment fees may apply as specified in your booking confirmation.`
        },
        {
          title: '1.2.3 Price Adjustments',
          content: 'We reserve the right to adjust prices due to: Currency fluctuations exceeding 3%, Fuel surcharges imposed by airlines, Government tax changes, and Supplier cost increases beyond our control.'
        }
      ]
    },
    {
      id: 'documentation',
      title: '1.3 Travel Documentation',
      icon: <FileText className="w-5 h-5" />,
      subsections: [
        {
          title: '1.3.1 Passport and Visa Requirements',
          content: `Valid passport required for international travel (minimum ${COMPANY_CONFIG.passportValidityMonths} months validity). Visa requirements vary by destination and nationality. Customers are responsible for obtaining necessary visas. We provide guidance but are not responsible for visa rejections.`
        },
        {
          title: '1.3.2 Health and Vaccination Requirements',
          content: 'Customers must meet all health requirements for destinations. Vaccination requirements vary by destination. Travel insurance with medical coverage is strongly recommended. Pre-existing medical conditions must be disclosed.'
        }
      ]
    },
    {
      id: 'insurance',
      title: '1.4 Travel Insurance',
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        {
          title: '1.4.1 Insurance Requirement',
          content: `Travel insurance is based on the location you travel. Please check with our agent.`
        },
        {
          title: '1.4.2 Insurance Claims',
          content: 'Customers must deal directly with insurance providers for claims. We provide assistance with documentation but are not liable for claim outcomes. Insurance must be purchased within specified timeframes.'
        }
      ]
    },
    {
      id: 'requirements',
      title: '1.5 Special Requirements',
      icon: <Users className="w-5 h-5" />,
      subsections: [
        {
          title: '1.5.1 Dietary and Accessibility Needs',
          content: 'Special dietary requirements must be specified at time of booking. Accessibility needs must be disclosed for appropriate arrangements. Additional costs may apply for special accommodations. We cannot guarantee all requirements can be met at all destinations.'
        },
        {
          title: '1.5.2 Age Restrictions',
          content: 'Minimum age requirements vary by package and destination. Unaccompanied minors require special arrangements. Age-appropriate activities are subject to local regulations. Parental consent required for travelers under 18.'
        }
      ]
    },
    {
      id: 'liability',
      title: '1.6 Liability and Limitations',
      icon: <Scale className="w-5 h-5" />,
      subsections: [
        {
          title: '1.6.1 Limitation of Liability',
          content: 'Our liability is limited to the total amount paid for your booking. We are not liable for: Indirect, consequential, or punitive damages, Loss of enjoyment or opportunity, Costs arising from trip delays or cancellations beyond our control, and Personal injury or property damage caused by third parties.'
        },
        {
          title: '1.6.2 Force Majeure',
          content: 'We are not liable for failures due to circumstances beyond our control including: Natural disasters, pandemics, or government actions, War, terrorism, or civil unrest, Strikes or industrial action, and Supplier failures or insolvency.'
        }
      ]
    },
    {
      id: 'responsibilities',
      title: '1.7 Customer Responsibilities',
      icon: <AlertCircle className="w-5 h-5" />,
      subsections: [
        {
          title: '1.7.1 Accurate Information',
          content: 'Customers must provide accurate and complete information including: Personal details matching travel documents, Health conditions that may affect travel, Dietary restrictions and accessibility needs, and Emergency contact information.'
        },
        {
          title: '1.7.2 Behavior Standards',
          content: 'Customers must: Respect local customs and laws, Follow guide instructions and safety protocols, Maintain appropriate travel documents, and Arrive punctually for all scheduled activities.'
        },
        {
          title: '1.7.3 Consequences of Non-Compliance',
          content: 'Failure to comply with these requirements may result in: Removal from tour without refund, Additional costs for alternative arrangements, Liability for damages or third-party claims, and Legal action if necessary.'
        }
      ]
    },
    {
      id: 'modifications',
      title: '1.8 Modifications and Amendments',
      icon: <Clock className="w-5 h-5" />,
      subsections: [
        {
          title: '1.8.1 Itinerary Changes',
          content: 'Minor itinerary changes may be necessary due to local conditions. Significant changes will be communicated in advance. We will provide alternative arrangements of similar value. No compensation for minor changes beyond our control.'
        },
        {
          title: '1.8.2 Customer-Requested Changes',
          content: 'Changes to confirmed bookings are subject to availability. Change fees may apply in addition to any price differences. Some changes may require full cancellation and rebooking. Changes requested close to departure may not be possible.'
        }
      ]
    },
    {
      id: 'complaints',
      title: '1.9 Complaints and Disputes',
      icon: <AlertTriangle className="w-5 h-5" />,
      subsections: [
        {
          title: '1.9.1 Complaint Process',
          content: `Complaints should be made in writing within ${COMPANY_CONFIG.complaintDeadlineDays} days of travel completion. Include detailed description of the issue and desired resolution. We will investigate and respond within ${COMPANY_CONFIG.complaintResponseDays} business days. Unresolved complaints may be escalated to relevant authorities.`
        },
        {
          title: '1.9.2 Dispute Resolution',
          content: `Disputes will be resolved through good-faith negotiation. Mediation may be required before legal proceedings. Governing law: ${COMPANY_CONFIG.legal.governingLaw}. Jurisdiction: ${COMPANY_CONFIG.legal.jurisdiction}.`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Booking Terms & Conditions</h1>
            <p className="text-xl opacity-90">{COMPANY_CONFIG.tagline}</p>
            <div className="mt-6 inline-flex items-center bg-white/10 rounded-full px-6 py-2">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">Last Updated: {COMPANY_CONFIG.legal.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="text-blue-600 mr-3 group-hover:text-blue-700">
                  {section.icon}
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="text-blue-600 mr-3">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
              </div>
              <div className="p-6">
                {section.subsections.map((subsection, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {subsection.title}
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-600 leading-relaxed">
                        {subsection.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-8">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">General Inquiries</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{COMPANY_CONFIG.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{COMPANY_CONFIG.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{COMPANY_CONFIG.contact.address}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-3" />
                  <span>{COMPANY_CONFIG.contact.website}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Booking & Emergency</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{COMPANY_CONFIG.contact.bookingEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{COMPANY_CONFIG.contact.emergencyPhone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{COMPANY_CONFIG.contact.emergencyEmail}</span>
                </div>
                <div className="text-sm opacity-90 mt-4">
                  Emergency support available 24/7 during travel
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              These terms are subject to change. Please review regularly for updates. 
              By booking with us, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTermsPage;