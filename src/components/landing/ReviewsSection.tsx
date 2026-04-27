'use client';

import { getColors } from '@/store/colorStore';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { Star } from 'lucide-react';

export const ReviewsSection = () => {
  const colors = getColors();
  
  const reviews = [
  {
    name: 'Sarah Johnson',
    role: 'Music Enthusiast',
    content: 'This platform completely changed how I watch videos with my long-distance friends. The sync is perfect every time!',
    rating: 5,
    avatar: 'https://plus.unsplash.com/premium_photo-1667520524170-f7f44b5b0376?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXNpYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Michael Chen',
    role: 'Content Creator',
    content: 'The ability to watch YouTube videos together in real-time is amazing. My community loves our watch parties!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1513097633097-329a3a64e0d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXNpYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Family User',
    content: 'We use the Family plan for our weekly movie nights. The shared playlists feature is a game-changer for us.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1529230815964-592d9b61876f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFzaWFuJTIwd29tYW58ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'David Kim',
    role: 'Student',
    content: 'Perfect for study groups. We watch lectures together and discuss them in real-time. So much better than Zoom!',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGFzaWFuJTIwd29tYW58ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Lisa Thompson',
    role: 'Podcast Host',
    content: 'The Discord integration is brilliant. My community can see what I am listening to and join in instantly.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1565019011521-b0575cbb57c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGFzaWFuJTIwd29tYW58ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'James Wilson',
    role: 'Tech Reviewer',
    content: 'Finally, a platform that gets watch parties right. The privacy controls and offline mode are top-notch.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1554365228-f051bbfbcab0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fGFzaWFuJTIwd29tYW58ZW58MHx8MHx8fDA%3D'
  }
];
  
  return (
    <section id="reviews" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Loved by{' '}
            <span style={{ color: colors.primary }}>Thousands</span>
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            See what our users are saying about their experience
          </p>
        </div>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              name={review.name}
              role={review.role}
              content={review.content}
              rating={review.rating}
              avatar={review.avatar}
            />
          ))}
        </div>
        
        {/* Stats Summary */}
        <div className="mt-12 text-center">
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            style={{ backgroundColor: `${colors.primary}10` }}
          >
            <span 
              className="font-bold text-2xl"
              style={{ color: colors.primary }}
            >
              4.8
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={colors.primary}
                  style={{ color: colors.primary }}
                />
              ))}
            </div>
            <span style={{ color: colors.text.secondary }}>
              based on 2,500+ reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};