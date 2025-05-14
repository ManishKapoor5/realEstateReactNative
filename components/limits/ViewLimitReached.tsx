import React from 'react';
import { AlertCircle, CheckCircle, Star } from 'lucide-react';
import { TierLimit } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface ViewLimitReachedProps {
  allowWaitlist?: boolean;
  tiers: TierLimit[];
  onUpgradeTier: (tierId: string) => void;
  onJoinWaitlist?: () => void;
}

const ViewLimitReached: React.FC<ViewLimitReachedProps> = ({
  allowWaitlist = false,
  tiers,
  onUpgradeTier,
  onJoinWaitlist
}) => {
  const { user } = useAuthStore();
  
  // Find the user's current tier and determine available upgrade options
  const currentTier = tiers.find(tier => tier.id === user?.tier);
  const upgradeTiers = tiers.filter(tier => 
    tier.id !== user?.tier && tier.propertyLimit > (currentTier?.propertyLimit || 0)
  );
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto">
      <div className="bg-red-50 p-6 border-b border-red-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">
              Property Viewing Limit Reached
            </h3>
            <p className="mt-2 text-red-700">
              You've reached your limit of {currentTier?.propertyLimit || 0} property views for your {currentTier?.name} account.
              Upgrade your account to view more properties.
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Available Options
        </h4>
        
        <div className="space-y-4">
          {upgradeTiers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgradeTiers.map(tier => (
                <div key={tier.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{tier.name}</h5>
                    {tier.price && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        ₹{tier.price}/mo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                  <div className="flex items-center text-gray-700 mb-4">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">View up to {tier.propertyLimit} properties</span>
                  </div>
                  <button
                    onClick={() => onUpgradeTier(tier.id)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Upgrade to {tier.name}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">
                You are already on our highest tier plan. Please contact support for custom solutions.
              </p>
            </div>
          )}
          
          {allowWaitlist && onJoinWaitlist && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <Star className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                <div>
                  <h5 className="font-medium text-gray-900">Join our Property Waitlist</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Join the waitlist to be notified when this property becomes available to your tier.
                  </p>
                  <button
                    onClick={onJoinWaitlist}
                    className="mt-3 py-1.5 px-4 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                  >
                    Join Waitlist
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLimitReached;