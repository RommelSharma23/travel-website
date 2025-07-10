// File: app/privacy-policy/page.tsx

import React from 'react';
import { Shield, Eye, Lock, Users, Globe, Phone, MapPin, Clock, UserCheck, Settings, AlertTriangle, FileText, Database, Share2 } from 'lucide-react';

// Dynamic Configuration - Update these values as needed
const PRIVACY_CONFIG = {
  companyName: "GetAway Vibe",
  tagline: "Your Vibe Your Journey Your Getaway",
  
  // Contact Information
  contact: {
    email: "info@getawayvibe.com",
    
   
    phone: "+91 7877995497",
    address: "Jaipur, Rajasthan, India",
    website: "www.getawayvibe.com",
   // privacyRightsForm: "www.getawayvibe.com/privacy-rights"
  },
  
  // Data Retention Periods
  dataRetention: {
    businessRecords: 7, // years
    responseTime: 30, // days for rights requests
    minAge: 13, // minimum age for services
    teenAge: 18 // age when parental consent may be required
  },
  
  // Legal Information
  legal: {
    effectiveDate: "January 2025",
    lastUpdated: "January 2025",
    jurisdiction: "India",
    dataProtectionOfficer: "Available upon request" // Set to actual name if you have a DPO
  }
};

const PrivacyPolicyPage = () => {
  const sections = [
    {
      id: 'information-collection',
      title: '1. Information We Collect',
      icon: <Database className="w-5 h-5" />,
      subsections: [
        {
          title: '1.1 Personal Information',
          content: `We collect the following personal information when you use our services: Contact Details (Name, email address, phone number, postal address), Travel Information (Travel preferences, destinations of interest, travel dates), Payment Information (Credit card details, billing address - processed securely through third-party processors), Travel Documents (Passport details, visa information, travel document copies), Health Information (Medical conditions, dietary restrictions, accessibility needs as required for travel), and Emergency Contacts (Names and contact information for emergency situations).`
        },
        {
          title: '1.2 Automatic Information Collection',
          content: 'We automatically collect certain information when you visit our website: Technical Information (IP address, browser type and version, operating system), Usage Data (Pages visited, time spent on site, clickstream data), Referral Information (Referring website, search terms used to find our site), Device Information (Device type, screen resolution, time zone settings), and Cookies and Tracking (Information collected through cookies and similar technologies).'
        },
        {
          title: '1.3 Third-Party Information',
          content: 'We may receive information about you from: Travel Service Providers (Hotels, airlines, tour operators, and other suppliers), Payment Processors (Transaction and payment verification information), Social Media Platforms (If you choose to connect your social media accounts), Travel Insurance Providers (Policy information and claims data), and Government Agencies (Visa processing and entry requirement information).'
        }
      ]
    },
    {
      id: 'information-usage',
      title: '2. How We Use Your Information',
      icon: <Settings className="w-5 h-5" />,
      subsections: [
        {
          title: '2.1 Service Provision',
          content: 'We use your information to: Process Bookings (Manage your travel arrangements and bookings), Communicate (Send booking confirmations, itineraries, and travel updates), Customer Support (Provide assistance and respond to your inquiries), Service Coordination (Arrange services with hotels, airlines, and tour operators), Payment Processing (Handle payments and maintain financial records), and Document Management (Assist with visa applications and travel document requirements).'
        },
        {
          title: '2.2 Marketing and Communication',
          content: 'With your consent, we may use your information to: Send Promotional Materials (offers, deals, and travel promotions), Provide Travel Information (destination guides, travel tips, and advice), Send Newsletters (regular updates about our services and travel trends), Conduct Surveys (customer satisfaction and feedback surveys), Personalization (customize your experience on our website and communications), and Social Media (share travel content and engage with you on social platforms).'
        },
        {
          title: '2.3 Legal and Business Operations',
          content: 'We may use your information for: Legal Compliance (meet regulatory requirements and legal obligations), Security (prevent fraud, ensure website security, and protect against abuse), Analytics (analyze website usage and improve our services), Dispute Resolution (resolve complaints and enforce our agreements), and Business Operations (manage our business, including accounting and auditing).'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: '3. Information Sharing',
      icon: <Share2 className="w-5 h-5" />,
      subsections: [
        {
          title: '3.1 Service Providers',
          content: 'We share information with trusted third parties who help us provide services: Travel Suppliers (Hotels, airlines, tour operators, and transportation providers), Payment Processors (Secure processing of your payment transactions), Technology Partners (Website hosting, email services, and customer support platforms), Insurance Providers (Travel insurance companies for policy administration), and Government Agencies (Visa processing and border control authorities as required).'
        },
        {
          title: '3.2 Legal Requirements',
          content: 'We may disclose your information when required by law or to: Legal Processes (comply with court orders, subpoenas, or legal requests), Law Enforcement (cooperate with police and regulatory investigations), Safety Protection (protect the safety of our customers, staff, or the public), Rights Protection (defend our legal rights and interests), and Fraud Prevention (prevent and detect fraudulent or illegal activities).'
        },
        {
          title: '3.3 Business Transfers',
          content: `In the event of a merger, acquisition, or sale of ${PRIVACY_CONFIG.companyName}, customer information may be transferred to the new entity, subject to the same privacy protections outlined in this policy.`
        }
      ]
    },
    {
      id: 'data-security',
      title: '4. Data Security',
      icon: <Lock className="w-5 h-5" />,
      subsections: [
        {
          title: '4.1 Security Measures',
          content: 'We implement comprehensive security measures to protect your information: Encryption (Sensitive data is encrypted both in transit and at rest), Access Controls (Strict access controls and authentication systems), Regular Audits (Periodic security assessments and vulnerability testing), Staff Training (Regular privacy and security training for all employees), and Secure Storage (Protected data centers with physical and digital security measures).'
        },
        {
          title: '4.2 Data Retention',
          content: `We retain your information only as long as necessary for: Service Provision (The duration of our business relationship), Legal Obligations (As required by applicable laws and regulations), Dispute Resolution (Until all potential disputes are resolved), Business Records (Generally ${PRIVACY_CONFIG.dataRetention.businessRecords} years after your last interaction with us), and Marketing (Until you opt out of marketing communications).`
        }
      ]
    },
    {
      id: 'user-rights',
      title: '5. Your Rights and Choices',
      icon: <UserCheck className="w-5 h-5" />,
      subsections: [
        {
          title: '5.1 Access and Control',
          content: 'You have the right to: Access (Request copies of your personal information), Correction (Update or correct inaccurate information), Deletion (Request deletion of your personal data subject to legal requirements), Portability (Receive your data in a structured, machine-readable format), Restriction (Limit how we process your personal information), and Objection (Object to processing based on legitimate interests).'
        },
        {
          title: '5.2 Marketing Preferences',
          content: 'You can control marketing communications by: Using Unsubscribe Links (in our emails), Updating Account Settings (in your online account), Direct Contact (contacting us directly to opt out), and Preference Center (using our online preference management tool).'
        },
        {
          title: '5.3 Cookie Management',
          content: 'You can manage cookies through your browser settings: Accept/Reject (choose to accept or reject cookies), Delete (remove existing cookies from your device), Notifications (receive alerts when cookies are being set), and Functionality (note that disabling cookies may affect website functionality).'
        }
      ]
    },
    {
      id: 'international-transfers',
      title: '6. International Data Transfers',
      icon: <Globe className="w-5 h-5" />,
      subsections: [
        {
          title: '6.1 Cross-Border Processing',
          content: 'Your information may be transferred to and processed in countries other than your country of residence for: Service Delivery (providing travel services in destination countries), Data Processing (using cloud services and technology platforms), Customer Support (providing support from different geographic locations), and Legal Compliance (meeting regulatory requirements in different jurisdictions).'
        },
        {
          title: '6.2 Transfer Safeguards',
          content: 'We ensure appropriate safeguards for international transfers through: Adequacy Decisions (relying on adequacy decisions by relevant data protection authorities), Standard Clauses (using standard contractual clauses approved by data protection authorities), Binding Rules (implementing binding corporate rules for intra-group transfers), and Other Mechanisms (using other legally recognized transfer mechanisms as appropriate).'
        }
      ]
    },
    {
      id: 'childrens-privacy',
      title: '7. Children\'s Privacy',
      icon: <Users className="w-5 h-5" />,
      subsections: [
        {
          title: '7.1 Age Restrictions',
          content: `Our services are not directed to children under ${PRIVACY_CONFIG.dataRetention.minAge} years of age. We do not knowingly collect personal information from children under ${PRIVACY_CONFIG.dataRetention.minAge}. If we become aware of such collection, we will delete the information promptly. Parents or guardians may contact us to request deletion of their child's information.`
        },
        {
          title: '7.2 Teen Privacy',
          content: `For users between ${PRIVACY_CONFIG.dataRetention.minAge} and ${PRIVACY_CONFIG.dataRetention.teenAge} years old: Parental consent may be required for certain activities, we may limit the collection and use of personal information, parents can request access to their teen's information, and special protections apply to sensitive information.`
        }
      ]
    },
    {
      id: 'third-party',
      title: '8. Third-Party Links and Services',
      icon: <Eye className="w-5 h-5" />,
      subsections: [
        {
          title: '8.1 External Links',
          content: 'Our website may contain links to third-party websites: We are not responsible for the privacy practices of these sites, third-party sites have their own privacy policies, we encourage you to review these policies before providing information, and links do not constitute endorsement of third-party practices.'
        },
        {
          title: '8.2 Social Media Integration',
          content: 'If you interact with our social media content: Social media platforms have their own privacy policies, information you share may be visible to other users, we may collect publicly available information from your social media profiles, and you can control social media privacy settings independently.'
        }
      ]
    },
    {
      id: 'policy-updates',
      title: '9. Updates to This Policy',
      icon: <Clock className="w-5 h-5" />,
      subsections: [
        {
          title: '9.1 Policy Changes',
          content: 'We may update this privacy policy from time to time. Changes will be posted on our website with the effective date. Significant changes will be communicated through email or website notices. Continued use of our services after changes constitutes acceptance.'
        },
        {
          title: '9.2 Version Control',
          content: 'Previous versions of this policy are available upon request. We maintain records of all policy changes. You can request information about specific changes.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">{PRIVACY_CONFIG.tagline}</p>
            <div className="mt-6 inline-flex items-center bg-white/10 rounded-full px-6 py-2">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">Effective Date: {PRIVACY_CONFIG.legal.effectiveDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="text-green-600 mt-1">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Privacy Matters</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At {PRIVACY_CONFIG.companyName}, we are committed to protecting your privacy and handling your personal 
                information responsibly. This Privacy Policy explains how we collect, use, share, and protect your 
                information when you use our travel services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                We encourage you to read this policy carefully and contact us if you have any questions.
              </p>
            </div>
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
                <div className="text-green-600 mr-3 group-hover:text-green-700">
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

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg text-white p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Phone className="w-6 h-6 mr-3" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Privacy Questions</h3>
              <div className="space-y-3">
               
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{PRIVACY_CONFIG.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{PRIVACY_CONFIG.contact.address}</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 mr-3" />
                  <span>DPO: {PRIVACY_CONFIG.legal.dataProtectionOfficer}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Rights Requests</h3>
              <div className="space-y-3">
                
               
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-3" />
                  <span>Written requests to our business address</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Response time: {PRIVACY_CONFIG.dataRetention.responseTime} days</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-lg font-semibold mb-4">Complaints Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="font-bold">1</span>
                </div>
                <span>Contact us directly to resolve issues</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="font-bold">2</span>
                </div>
                <span>Contact your local data protection authority</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <span className="font-bold">3</span>
                </div>
                <span>Consult with legal counsel if needed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start justify-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-green-800">
                <p className="font-medium mb-2">Important Notice</p>
                <p className="text-sm leading-relaxed">
                  This Privacy Policy applies to all information collected through our website, mobile applications, 
                  and other digital platforms. For specific questions about how we handle your personal information, 
                  please contact us using the information provided above.
                </p>
                <p className="text-xs mt-3 opacity-75">
                  Last Updated: {PRIVACY_CONFIG.legal.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;