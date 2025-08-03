// components/ui/ShareButtons.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Copy, Mail, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  showLabels?: boolean;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title = 'Check out this amazing travel story!',
  description = 'Discover incredible travel experiences and tips.',
  hashtags = ['travel', 'adventure', 'wanderlust'],
  className = '',
  showLabels = true,
  variant = 'horizontal'
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Get current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);
  const shareHashtags = hashtags.join(',');

  // Share handlers
  const handleFacebookShare = useCallback(() => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${shareDescription}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  }, [shareUrl, shareDescription]);

  const handleTwitterShare = useCallback(() => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}&hashtags=${shareHashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }, [shareUrl, shareTitle, shareHashtags]);

  const handleLinkedInShare = useCallback(() => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${shareTitle}&summary=${shareDescription}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  }, [shareUrl, shareTitle, shareDescription]);

  const handleWhatsAppShare = useCallback(() => {
    const whatsappUrl = `https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  }, [shareUrl, shareTitle]);

  const handleEmailShare = useCallback(() => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\nRead more: ${shareUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  }, [shareUrl, title, description]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  }, [title, description, shareUrl]);

  // Check if native sharing is available
  const hasNativeShare = typeof window !== 'undefined' && navigator.share;

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: handleFacebookShare,
      className: 'bg-blue-600 hover:bg-blue-700 text-white',
      show: true
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: handleTwitterShare,
      className: 'bg-sky-500 hover:bg-sky-600 text-white',
      show: true
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: handleLinkedInShare,
      className: 'bg-blue-700 hover:bg-blue-800 text-white',
      show: true
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: handleWhatsAppShare,
      className: 'bg-green-500 hover:bg-green-600 text-white',
      show: true
    },
    {
      name: 'Email',
      icon: Mail,
      onClick: handleEmailShare,
      className: 'bg-gray-600 hover:bg-gray-700 text-white',
      show: true
    },
    {
      name: copied ? 'Copied!' : 'Copy Link',
      icon: Copy,
      onClick: handleCopyLink,
      className: `${copied ? 'bg-green-500' : 'bg-gray-500'} hover:bg-gray-600 text-white`,
      show: true
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        {/* Native share button if available */}
        {hasNativeShare ? (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        ) : (
          <>
            {/* Compact share trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-50">
                {shareButtons.filter(btn => btn.show).map((button) => {
                  const Icon = button.icon;
                  return (
                    <button
                      key={button.name}
                      onClick={() => {
                        button.onClick();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      {button.name}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showLabels && (
        <h3 className="text-sm font-medium text-gray-700 mb-3">Share this story:</h3>
      )}
      
      <div className={`flex gap-3 ${variant === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}`}>
        {/* Native share button for mobile */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            <Share2 className="w-4 h-4" />
            {showLabels && 'Share'}
          </button>
        )}

        {/* Individual share buttons */}
        {shareButtons.filter(btn => btn.show).map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.name}
              onClick={button.onClick}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${button.className}`}
              title={`Share on ${button.name}`}
            >
              <Icon className="w-4 h-4" />
              {showLabels && (
                <span className={variant === 'vertical' ? 'block' : 'hidden sm:block'}>
                  {button.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Copy success message */}
      {copied && (
        <div className="mt-2 text-sm text-green-600 font-medium">
          ✓ Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default ShareButtons;