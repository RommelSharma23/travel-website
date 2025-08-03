// File: app/terms-of-service/page.tsx

import React from 'react';
import { FileText, Shield, Users, Globe, AlertTriangle, Phone, Mail, MapPin, Clock, Scale, Eye, Lock, Gavel, UserX, Settings } from 'lucide-react';

// Dynamic Configuration - Update these values as needed
const TERMS_CONFIG = {
  companyName: "GetAway Vibe",
  tagline: "Your Vibe Your Journey Your Getaway",
  
  // Contact Information
  contact: {
    phone: "+91 7877995497",
    email: "info@getawayvibe.com",
    legalEmail: "support@getawayvibe.com",
    supportEmail: "support@getawayvibe.com",
    accessibilityEmail: "support@getawayvibe.com",
    address: "Jaipur, Rajasthan, India",
    website: "www.getawayvibe.com",
    businessHours: "Monday - Saturday, 9:00 AM - 7:00 PM IST"
  },
  
  // Age and Legal Requirements
  legalRequirements: {
    minimumAge: 18,
    accountSuspensionReasons: [
      "Breach of Terms",
      "Fraudulent or illegal activity", 
      "Service discontinuation",
      "Legal or regulatory requirements"
    ]
  },
  
  // Service Features
  services: {
    travelServices: [
      "Destination information and travel guides",
      "Tour package recommendations", 
      "Travel arrangement coordination",
      "Customer support and assistance",
      "Travel-related advice and guidance"
    ],
    websiteFeatures: [
      "Researching travel destinations and services",
      "Submitting legitimate travel inquiries",
      "Accessing your booking information",
      "Communicating with our staff",
      "Subscribing to our newsletter and updates"
    ],
    prohibitedUses: [
      "Illegal activities or fraud",
      "Harassing or abusing our staff",
      "Submitting false information", 
      "Attempting to damage or disrupt our systems",
      "Violating intellectual property rights",
      "Commercial use without permission"
    ]
  },
  
  // Legal Information
  legal: {
    governingLaw: "India",
    jurisdiction: "Rajasthan Courts",
    effectiveDate: "January 2025",
    lastUpdated: "January 2025"
  }
};

const TermsOfServicePage = () => {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <FileText className="w-5 h-5" />,
      subsections: [
        {
          title: '1.1 Agreement to Terms',
          content: `By accessing or using our website and services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.`
        },
        {
          title: '1.2 Modifications',
          content: 'We reserve the right to modify these Terms at any time. Changes will be posted on our website with the effective date. Continued use of our services after changes constitutes acceptance of the new Terms.'
        },
        {
          title: '1.3 Capacity to Contract',
          content: `You represent that you are at least ${TERMS_CONFIG.legalRequirements.minimumAge} years old and have the legal capacity to enter into these Terms. If booking on behalf of others, you represent that you have their authority to do so.`
        }
      ]
    },
    {
      id: 'service-description',
      title: '2. Service Description',
      icon: <Globe className="w-5 h-5" />,
      subsections: [
        {
          title: '2.1 Travel Services',
          content: `We provide travel planning and booking services including: ${TERMS_CONFIG.services.travelServices.join(', ')}.`
        },
        {
          title: '2.2 Inquiry-Based System',
          content: 'Our booking process is inquiry-based: All requests are subject to availability confirmation, pricing may vary based on final arrangements, bookings are not confirmed until deposit is paid, and we reserve the right to decline any booking request.'
        },
        {
          title: '2.3 Third-Party Services',
          content: 'We coordinate with various travel service providers: Hotels and accommodation providers, airlines and transportation companies, local tour operators and guides, restaurant and activity providers, and travel insurance companies.'
        }
      ]
    },
    {
      id: 'website-use',
      title: '3. Website Use',
      icon: <Users className="w-5 h-5" />,
      subsections: [
        {
          title: '3.1 Permitted Use',
          content: `You may use our website for: ${TERMS_CONFIG.services.websiteFeatures.join(', ')}.`
        },
        {
          title: '3.2 Prohibited Use',
          content: `You may not use our website for: ${TERMS_CONFIG.services.prohibitedUses.join(', ')}.`
        },
        {
          title: '3.3 Account Security',
          content: 'If you create an account: Keep your login credentials secure, notify us immediately of any unauthorized use, you are responsible for all activities under your account, and we may suspend accounts for security reasons.'
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: '4. Intellectual Property',
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        {
          title: '4.1 Our Content',
          content: 'All content on our website is protected by intellectual property laws: Text, images, and videos are our property or used with permission, trademarks and logos are protected, website design and functionality are proprietary, and you may not reproduce or distribute our content without permission.'
        },
        {
          title: '4.2 User-Generated Content',
          content: 'If you submit content to us (reviews, photos, comments): You grant us a license to use and display the content, you represent that you own the rights to the content, you are responsible for ensuring content is lawful and appropriate, and we may moderate or remove content at our discretion.'
        },
        {
          title: '4.3 License Grant',
          content: 'We grant you a limited, non-exclusive, revocable license to: Access and use our website for personal, non-commercial purposes, view and download content for personal use only, print individual pages for personal reference. This license terminates if you violate these Terms.'
        }
      ]
    },
    {
      id: 'disclaimers',
      title: '5. Disclaimers',
      icon: <AlertTriangle className="w-5 h-5" />,
      subsections: [
        {
          title: '5.1 Service Availability',
          content: 'Our website and services are provided "as is". We do not guarantee continuous availability. Maintenance and updates may cause temporary interruptions. We are not liable for technical issues or downtime.'
        },
        {
          title: '5.2 Information Accuracy',
          content: 'We strive to provide accurate information but cannot guarantee it. Travel information may change without notice. Prices and availability are subject to change. You should verify important information independently.'
        },
        {
          title: '5.3 Third-Party Content',
          content: 'We may include links to third-party websites. We are not responsible for third-party content or services. Third-party sites have their own terms and privacy policies. Use of third-party services is at your own risk.'
        }
      ]
    },
    {
      id: 'liability-limitation',
      title: '6. Limitation of Liability',
      icon: <Scale className="w-5 h-5" />,
      subsections: [
        {
          title: '6.1 Damages Limitation',
          content: 'To the maximum extent permitted by law: Our liability is limited to the amount you paid for services, we are not liable for indirect, consequential, or punitive damages, we are not liable for lost profits or opportunities, and these limitations apply regardless of the cause of action.'
        },
        {
          title: '6.2 Exclusions',
          content: 'We are not liable for: Acts of third-party service providers, force majeure events, your failure to follow instructions or requirements, losses that could have been avoided with reasonable care, and damages resulting from your breach of these Terms.'
        },
        {
          title: '6.3 Maximum Liability',
          content: 'Our maximum liability for any claim is limited to the total amount paid by you for the specific service giving rise to the claim.'
        }
      ]
    },
    {
      id: 'indemnification',
      title: '7. Indemnification',
      icon: <Gavel className="w-5 h-5" />,
      subsections: [
        {
          title: '7.1 Your Indemnification',
          content: 'You agree to indemnify and hold us harmless from: Claims arising from your use of our services, your breach of these Terms, your violation of applicable laws, your infringement of third-party rights, and damages caused by your negligence or misconduct.'
        },
        {
          title: '7.2 Defense of Claims',
          content: 'We reserve the right to assume the exclusive defense of any claim subject to indemnification, and you agree to cooperate with our defense.'
        }
      ]
    },
    {
      id: 'privacy-data',
      title: '8. Privacy and Data Protection',
      icon: <Lock className="w-5 h-5" />,
      subsections: [
        {
          title: '8.1 Privacy Policy',
          content: 'Your privacy is important to us. Please review our Privacy Policy, which governs how we collect, use, and protect your personal information.'
        },
        {
          title: '8.2 Data Security',
          content: 'We implement reasonable security measures to protect your information, but cannot guarantee absolute security.'
        },
        {
          title: '8.3 Data Breach',
          content: 'In the event of a data breach, we will notify affected users and relevant authorities as required by law.'
        }
      ]
    },
    {
      id: 'governing-law',
      title: '9. Governing Law and Jurisdiction',
      icon: <Scale className="w-5 h-5" />,
      subsections: [
        {
          title: '9.1 Governing Law',
          content: `These Terms are governed by the laws of ${TERMS_CONFIG.legal.governingLaw}, without regard to conflict of law principles.`
        },
        {
          title: '9.2 Jurisdiction',
          content: `Any disputes will be resolved exclusively in the ${TERMS_CONFIG.legal.jurisdiction}, and you consent to personal jurisdiction in such courts.`
        },
        {
          title: '9.3 Dispute Resolution',
          content: 'Before pursuing legal action: Contact us to attempt resolution, consider mediation if direct negotiation fails, arbitration may be required for certain disputes, and class action lawsuits are waived where legally permitted.'
        }
      ]
    },
    {
      id: 'termination',
      title: '10. Termination',
      icon: <UserX className="w-5 h-5" />,
      subsections: [
        {
          title: '10.1 Termination by You',
          content: 'You may terminate your use of our services at any time by: Discontinuing use of our website, closing your account (if applicable), and providing written notice for active bookings.'
        },
        {
          title: '10.2 Termination by Us',
          content: `We may terminate or suspend your access if: ${TERMS_CONFIG.legalRequirements.accountSuspensionReasons.join(', ')}.`
        },
        {
          title: '10.3 Effect of Termination',
          content: 'Upon termination: Your right to use our services ceases, existing bookings remain subject to our booking terms, and provisions that should survive termination will continue.'
        }
      ]
    },
    {
      id: 'general-provisions',
      title: '11. General Provisions',
      icon: <Settings className="w-5 h-5" />,
      subsections: [
        {
          title: '11.1 Entire Agreement',
          content: 'These Terms, along with our Privacy Policy and Booking Terms, constitute the entire agreement between us regarding our services.'
        },
        {
          title: '11.2 Severability',
          content: 'If any provision of these Terms is found invalid or unenforceable, the remaining provisions will continue to be enforceable.'
        },
        {
          title: '11.3 Waiver',
          content: 'Our failure to enforce any provision does not waive our right to enforce it later or any other provision.'
        },
        {
          title: '11.4 Assignment',
          content: 'You may not assign these Terms without our written consent. We may assign these Terms without notice to you.'
        },
        {
          title: '11.5 Force Majeure',
          content: 'We are not liable for delays or failures due to circumstances beyond our reasonable control, including natural disasters, government actions, or technical failures.'
        }
      ]
    },
    {
      id: 'accessibility',
      title: '12. Accessibility',
      icon: <Eye className="w-5 h-5" />,
      subsections: [
        {
          title: '12.1 Accessibility Commitment',
          content: 'We are committed to making our website accessible to users with disabilities and strive to comply with applicable accessibility standards.'
        },
        {
          title: '12.2 Accessibility Features',
          content: 'Our website includes: Alternative text for images, keyboard navigation support, screen reader compatibility, and color contrast compliance.'
        },
        {
          title: '12.3 Accessibility Feedback',
          content: `If you experience accessibility issues: Contact us at ${TERMS_CONFIG.contact.accessibilityEmail}, we will work to resolve issues promptly, and alternative formats may be available upon request.`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl opacity-90">{TERMS_CONFIG.tagline}</p>
            <div className="mt-6 inline-flex items-center bg-white/10 rounded-full px-6 py-2">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">Effective Date: {TERMS_CONFIG.legal.effectiveDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="text-purple-600 mt-1">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to {TERMS_CONFIG.companyName}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                These Terms of Service govern your use of our website and services. By accessing or using our 
                services, you agree to be bound by these terms and conditions.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Please read these terms carefully before using our services. If you do not agree with any part 
                of these terms, you may not access or use our services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">User Requirements</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Must be {TERMS_CONFIG.legalRequirements.minimumAge}+ years old with legal capacity to enter agreements
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Our Services</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Travel planning, booking coordination, and customer support services
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Legal Framework</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Governed by {TERMS_CONFIG.legal.governingLaw} law, {TERMS_CONFIG.legal.jurisdiction} jurisdiction
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="text-purple-600 mr-3 group-hover:text-purple-700">
                  {section.icon}
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 font-medium text-sm">
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
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="text-purple-600 mr-3">
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg text-white p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Phone className="w-6 h-6 mr-3" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">General Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{TERMS_CONFIG.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{TERMS_CONFIG.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{TERMS_CONFIG.contact.address}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-3" />
                  <span>{TERMS_CONFIG.contact.website}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Specialized Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Gavel className="w-4 h-4 mr-3" />
                  <span>Legal: {TERMS_CONFIG.contact.legalEmail}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-3" />
                  <span>Support: {TERMS_CONFIG.contact.supportEmail}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-3" />
                  <span>Accessibility: {TERMS_CONFIG.contact.accessibilityEmail}</span>
                </div>
                <div className="text-sm opacity-90 mt-4">
                  Business Hours: {TERMS_CONFIG.contact.businessHours}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-lg font-semibold mb-4">Legal Notices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2"><strong>Legal notices should be sent to:</strong></p>
                <p>Email: {TERMS_CONFIG.contact.legalEmail}</p>
                <p>Mail: {TERMS_CONFIG.contact.address}</p>
                <p>Attention: Legal Department</p>
              </div>
              <div>
                <p className="mb-2"><strong>Dispute Resolution:</strong></p>
                <p>1. Contact us directly for resolution</p>
                <p>2. Consider mediation if needed</p>
                <p>3. Arbitration may be required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start justify-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="text-purple-800">
                <p className="font-medium mb-2">Important Legal Notice</p>
                <p className="text-sm leading-relaxed">
                  These Terms of Service govern your use of our website and services. Please read them carefully 
                  and contact us if you have any questions. By using our services, you acknowledge that you have 
                  read, understood, and agree to be bound by these terms.
                </p>
                <p className="text-xs mt-3 opacity-75">
                  Last Updated: {TERMS_CONFIG.legal.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;