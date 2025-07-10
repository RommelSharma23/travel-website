// File: app/cancellation-policy/page.tsx

import React from 'react';
import { XCircle, Calendar, CreditCard, Shield, AlertTriangle, Phone, Mail, MapPin, Clock, FileText, RefreshCw, Globe, HelpCircle } from 'lucide-react';

// Dynamic Configuration - Update these values as needed
const CANCELLATION_CONFIG = {
  companyName: "GetAway Vibe",
  tagline: "Your Vibe Your Journey Your Getaway",
  
  // Contact Information
  contact: {
    phone: "+91 7877995497",
    emergencyPhone: "+91 7877995497", // Same as main for now
    whatsapp: "+91 7877995497",
    email: "info@getawayvibe.com",
    cancellationsEmail: "support@getawayvibe.com",
    emergencyEmail: "support@getawayvibe.com",
    supportEmail: "support@getawayvibe.com",
    address: "Jaipur, Rajasthan, India",
    website: "www.getawayvibe.com",
    cancellationForm: "www.getawayvibe.com/cancellation-form",
    businessHours: "Monday - Saturday, 9:00 AM - 7:00 PM IST"
  },
  
  // Cancellation Fee Structure
  cancellationFees: {
    moreThan60Days: 10,
    days31to60: 25,
    days15to30: 50,
    days7to14: 75,
    lessThan7Days: 100
  },
  
  // Processing Times
  processing: {
    refundProcessingDays: "5-7 business days",
    refundIssuanceDays: "14-21 business days",
    cancellationConfirmation: "24 hours",
    writtenConfirmation: "3 business days",
    disputeResponseDays: 14,
    disputeDeadlineDays: 30
  },
  
  // Group Booking Thresholds
  groupBooking: {
    minimumSize: 10
  },
  
  // Legal Information
  legal: {
    governingLaw: "India",
    jurisdiction: "Rajasthan",
    effectiveDate: "January 2025",
    lastUpdated: "January 2025"
  }
};

const CancellationPolicyPage = () => {
  const cancellationFeeStructure = [
    { period: "More than 60 days before departure", fee: `${CANCELLATION_CONFIG.cancellationFees.moreThan60Days}%`, color: "text-green-600" },
    { period: "31-60 days before departure", fee: `${CANCELLATION_CONFIG.cancellationFees.days31to60}%`, color: "text-yellow-600" },
    { period: "15-30 days before departure", fee: `${CANCELLATION_CONFIG.cancellationFees.days15to30}%`, color: "text-orange-600" },
    { period: "7-14 days before departure", fee: `${CANCELLATION_CONFIG.cancellationFees.days7to14}%`, color: "text-red-500" },
    { period: "Less than 7 days before departure", fee: `${CANCELLATION_CONFIG.cancellationFees.lessThan7Days}% (No refund)`, color: "text-red-700" }
  ];

  const nonRefundableItems = [
    "Visa application fees",
    "Travel insurance premiums", 
    "Airline ticket fees (subject to airline policies)",
    "Hotel cancellation fees imposed by properties",
    "Tour operator fees for confirmed bookings",
    "Credit card processing fees"
  ];

  const sections = [
    {
      id: 'overview',
      title: '1. Cancellation Overview',
      icon: <XCircle className="w-5 h-5" />,
      subsections: [
        {
          title: '1.1 Cancellation Rights',
          content: 'You may cancel your booking subject to the terms and conditions outlined in this policy. Cancellation fees apply based on the timing of cancellation and the specific services booked.'
        },
        {
          title: '1.2 Cancellation Process',
          content: `To cancel your booking: Contact us in writing (email or letter), provide your booking reference number, specify the reason for cancellation. Cancellation is effective from the date we receive written notice. Cancellation fees are calculated from the effective date.`
        },
        {
          title: '1.3 Refund Processing',
          content: `Refunds are processed within ${CANCELLATION_CONFIG.processing.refundProcessingDays}. Refunds are issued within ${CANCELLATION_CONFIG.processing.refundIssuanceDays}. Refunds are made to the original payment method. Bank fees may be deducted from refunds. Some payments may be non-refundable as specified below.`
        }
      ]
    },
    {
      id: 'cancellation-fees',
      title: '2. Cancellation Fees',
      icon: <CreditCard className="w-5 h-5" />,
      subsections: [
        {
          title: '2.1 Standard Cancellation Fees',
          content: 'Cancellation fees are calculated based on the timing of your cancellation request. See the fee structure table below for detailed breakdown.'
        },
        {
          title: '2.2 Non-Refundable Components',
          content: 'The following are non-refundable regardless of cancellation timing: Visa application fees, travel insurance premiums, airline ticket fees (subject to airline policies), hotel cancellation fees imposed by properties, tour operator fees for confirmed bookings, and credit card processing fees.'
        },
        {
          title: '2.3 Group Booking Cancellations',
          content: `For group bookings (${CANCELLATION_CONFIG.groupBooking.minimumSize}+ people): Individual cancellations may affect group pricing. Minimum group size requirements must be maintained. Additional fees may apply if group size falls below minimum. Group leader is responsible for all cancellation communications.`
        }
      ]
    },
    {
      id: 'supplier-cancellations',
      title: '3. Supplier-Imposed Cancellations',
      icon: <Globe className="w-5 h-5" />,
      subsections: [
        {
          title: '3.1 Airline Cancellations',
          content: 'Airline tickets are subject to airline cancellation policies. Refundability depends on ticket type purchased. Change fees may apply even for refundable tickets. Travel insurance may cover some airline cancellation costs.'
        },
        {
          title: '3.2 Hotel Cancellations',
          content: 'Hotel reservations are subject to individual property policies. Cancellation fees vary by hotel and booking type. Peak season bookings often have stricter cancellation terms. Some properties may charge 100% for cancellations.'
        },
        {
          title: '3.3 Tour Operator Cancellations',
          content: 'Local tour operators may have their own cancellation policies. Advance booking requirements may include cancellation penalties. Specialized tours (safaris, treks) often have higher cancellation fees. Weather-dependent activities may have specific cancellation terms.'
        }
      ]
    },
    {
      id: 'medical-emergency',
      title: '4. Medical and Emergency Cancellations',
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        {
          title: '4.1 Medical Cancellations',
          content: 'If you must cancel due to medical reasons: Medical documentation may be required. Travel insurance may cover medical cancellation costs. Reduced cancellation fees may apply with proper documentation. Pre-existing conditions may not be covered.'
        },
        {
          title: '4.2 Emergency Cancellations',
          content: 'For emergency cancellations (death in family, natural disasters): Documentation of emergency circumstances required. Travel insurance may provide coverage. Case-by-case review for fee reduction. Some fees may still apply despite emergency circumstances.'
        },
        {
          title: '4.3 Documentation Requirements',
          content: 'Required documentation may include: Medical certificates from qualified practitioners, death certificates for family emergencies, official notices for natural disasters or government restrictions, and police reports for criminal incidents.'
        }
      ]
    },
    {
      id: 'company-cancellations',
      title: '5. Company-Initiated Cancellations',
      icon: <RefreshCw className="w-5 h-5" />,
      subsections: [
        {
          title: '5.1 Insufficient Participation',
          content: 'If we cancel due to insufficient bookings: Full refund of all payments made. No cancellation fees charged. Alternative dates or destinations may be offered. Reasonable advance notice will be provided (typically 30 days).'
        },
        {
          title: '5.2 Force Majeure Cancellations',
          content: 'If we cancel due to circumstances beyond our control: Natural disasters, pandemics, or government restrictions, war, terrorism, or civil unrest, supplier failures or insolvency. Full refund of payments made, less non-recoverable costs.'
        },
        {
          title: '5.3 Safety Cancellations',
          content: 'If we cancel for safety reasons: Full refund of all payments made. Alternative arrangements may be offered. Travel insurance may cover additional costs. Safety of customers is our primary concern.'
        }
      ]
    },
    {
      id: 'trip-changes',
      title: '6. Trip Interruption and Changes',
      icon: <Calendar className="w-5 h-5" />,
      subsections: [
        {
          title: '6.1 Trip Interruption',
          content: 'If your trip is interrupted after departure: Refunds are calculated based on unused services. No refund for partially used services. Travel insurance may cover interruption costs. We will assist with alternative arrangements where possible.'
        },
        {
          title: '6.2 Itinerary Changes',
          content: 'For changes to confirmed bookings: Changes are subject to availability and supplier policies. Change fees may apply in addition to any price differences. Some changes may require full cancellation and rebooking. Travel insurance may cover some change costs.'
        },
        {
          title: '6.3 Weather-Related Interruptions',
          content: 'For weather-related trip interruptions: Seasonal weather patterns are considered normal. Extreme weather events may qualify for insurance coverage. Alternative activities may be arranged when possible. Refunds are not provided for normal weather conditions.'
        }
      ]
    },
    {
      id: 'special-circumstances',
      title: '7. Special Circumstances',
      icon: <AlertTriangle className="w-5 h-5" />,
      subsections: [
        {
          title: '7.1 Visa Denials',
          content: 'If your visa application is denied: Cancellation fees apply as per standard policy. Travel insurance may cover visa denial costs. Documentation of denial required. Unused visa fees are non-refundable.'
        },
        {
          title: '7.2 Travel Advisories',
          content: 'If government travel advisories are issued: Cancellation fees may still apply. Travel insurance may provide coverage. Case-by-case review based on advisory level. Alternative destinations may be offered.'
        },
        {
          title: '7.3 Pregnancy and Medical Conditions',
          content: 'For pregnancy-related cancellations: Medical documentation required. Travel insurance may provide coverage. Cancellation fees may apply. Consultation with healthcare providers recommended.'
        }
      ]
    },
    {
      id: 'travel-insurance',
      title: '8. Travel Insurance',
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        {
          title: '8.1 Insurance Importance',
          content: 'Travel insurance is strongly recommended to protect against: Medical emergencies and evacuation, trip cancellation and interruption, lost or delayed luggage, travel delays and missed connections, and supplier insolvency.'
        },
        {
          title: '8.2 Insurance Requirements',
          content: 'For certain destinations or activities: Insurance may be mandatory. Minimum coverage amounts may be required. Specific coverage types may be needed. Proof of insurance must be provided before travel.'
        },
        {
          title: '8.3 Insurance Claims Process',
          content: 'For insurance claims: Contact your insurance provider immediately. Provide all required documentation. Follow claim procedures precisely. Keep all receipts and documentation.'
        }
      ]
    },
    {
      id: 'refund-process',
      title: '9. Refund Process',
      icon: <RefreshCw className="w-5 h-5" />,
      subsections: [
        {
          title: '9.1 Refund Timeline',
          content: `Refund requests are processed within ${CANCELLATION_CONFIG.processing.refundProcessingDays}. Refunds are issued within ${CANCELLATION_CONFIG.processing.refundIssuanceDays} of processing. International refunds may take longer. Bank processing times vary by institution.`
        },
        {
          title: '9.2 Refund Methods',
          content: 'Refunds are made to the original payment method. Credit card refunds may take 2-3 billing cycles to appear. Bank transfers may incur additional fees. Alternative refund methods may be available upon request.'
        },
        {
          title: '9.3 Refund Calculations',
          content: 'Refund amounts are calculated as follows: Total amount paid minus applicable cancellation fees, minus any non-refundable components, minus processing fees if applicable, plus any recoverable supplier refunds.'
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my booking if I change my mind?",
      answer: "Yes, but cancellation fees apply based on the timing of your cancellation."
    },
    {
      question: "What happens if I need to cancel due to illness?",
      answer: "Medical cancellations may qualify for reduced fees with proper documentation. Travel insurance is recommended."
    },
    {
      question: "Are deposits refundable?",
      answer: "Deposits are subject to the same cancellation fee structure as the full package."
    },
    {
      question: "Can I transfer my booking to someone else?",
      answer: "Name changes may be possible subject to supplier policies and fees."
    },
    {
      question: "Will travel insurance cover my cancellation?",
      answer: "It depends on your policy and the reason for cancellation. Review your insurance terms carefully."
    },
    {
      question: "When should I purchase travel insurance?",
      answer: "As soon as you make your booking to ensure maximum coverage."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Cancellation Policy</h1>
            <p className="text-xl opacity-90">{CANCELLATION_CONFIG.tagline}</p>
            <div className="mt-6 inline-flex items-center bg-white/10 rounded-full px-6 py-2">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">Effective Date: {CANCELLATION_CONFIG.legal.effectiveDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-amber-800 mb-2">Important Notice</h2>
              <p className="text-amber-700 leading-relaxed">
                This cancellation policy is designed to be fair to both customers and our business while reflecting 
                the realities of travel planning. We strongly encourage all travelers to purchase comprehensive 
                travel insurance to protect against unforeseen circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Fee Structure */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-red-600" />
            Cancellation Fee Structure
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cancellation Period</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cancellation Fee</th>
                </tr>
              </thead>
              <tbody>
                {cancellationFeeStructure.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-600">{item.period}</td>
                    <td className={`py-4 px-4 font-semibold ${item.color}`}>{item.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Non-Refundable Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-orange-600" />
            Non-Refundable Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nonRefundableItems.map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                <XCircle className="w-4 h-4 text-red-500 mr-3" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-red-50 px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="text-red-600 mr-3">
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

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg text-white p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Phone className="w-6 h-6 mr-3" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Cancellation Requests</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{CANCELLATION_CONFIG.contact.cancellationsEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{CANCELLATION_CONFIG.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{CANCELLATION_CONFIG.contact.address}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-3" />
                  <span>{CANCELLATION_CONFIG.contact.cancellationForm}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Support (24/7)</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{CANCELLATION_CONFIG.contact.emergencyPhone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{CANCELLATION_CONFIG.contact.emergencyEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>WhatsApp: {CANCELLATION_CONFIG.contact.whatsapp}</span>
                </div>
                <div className="text-sm opacity-90 mt-4">
                  Business Hours: {CANCELLATION_CONFIG.contact.businessHours}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-lg font-semibold mb-4">Processing Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="font-bold">1</span>
                </div>
                <span>Cancellation confirmed within {CANCELLATION_CONFIG.processing.cancellationConfirmation}</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="font-bold">2</span>
                </div>
                <span>Refund processed within {CANCELLATION_CONFIG.processing.refundProcessingDays}</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="font-bold">3</span>
                </div>
                <span>Refund issued within {CANCELLATION_CONFIG.processing.refundIssuanceDays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start justify-center space-x-3">
              <FileText className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-red-800">
                <p className="font-medium mb-2">Legal Notice</p>
                <p className="text-sm leading-relaxed">
                  This cancellation policy is governed by the laws of {CANCELLATION_CONFIG.legal.governingLaw} and 
                  any disputes will be resolved in the courts of {CANCELLATION_CONFIG.legal.jurisdiction}. 
                  This policy does not override your statutory consumer rights under applicable consumer protection laws.
                </p>
                <p className="text-xs mt-3 opacity-75">
                  Last Updated: {CANCELLATION_CONFIG.legal.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyPage;