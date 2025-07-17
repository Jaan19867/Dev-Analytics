'use client';
import { CheckIcon } from '@/components/icons';
import { addMonths } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/store/userId.context';
import axios from 'axios';
import { useEffect, useCallback } from 'react';
import React from 'react';
import { InfoIcon } from 'lucide-react';

type Period = 'monthly' | 'quarterly' | 'halfYearly' | 'yearly';

interface PeriodSelectionProps {
  selectedPeriod: Period;
  onSelectPeriod: (period: Period) => void;
}

const plans = [
  {
    name: 'Free',
    description: 'Complete access to all analytics features - No payment required!',
    prices: {
      monthly: '0',
      quarterly: '0',
      halfYearly: '0',
      yearly: '0',
    },
    originalPrices: {
      monthly: '0',
      quarterly: '0',
      halfYearly: '0',
      yearly: '0',
    },
    isPopular: true,
    features: [
      'Unlimited websites',
      'Unlimited analytics',
      'Advanced analytics',
      'Priority support',
      'Real-time data',
      'Custom dashboards',
      'Export capabilities',
      'API access'
    ],
  },
];

const periods = [
  { value: 'monthly', label: 'Month' },
  { value: 'quarterly', label: 'Quarter' },
  { value: 'halfYearly', label: 'Half Yearly' },
  { value: 'yearly', label: 'Yearly' },
];

const PeriodSelection: React.FC<PeriodSelectionProps> = React.memo(({ selectedPeriod, onSelectPeriod }) => {
  return (
    <div className="space-y-4 mt-3">
      <div className="flex flex-wrap gap-2">
        {periods.map((period) => (
          <Button
            key={period.value}
            variant={selectedPeriod === period.value ? 'default' : 'outline'}
            onClick={() => onSelectPeriod(period.value as Period)}
            className="flex-1 min-w-[120px]"
          >
            {period.label}
          </Button>
        ))}
      </div>
    </div>
  );
});

interface PlanListProps {
  selectedPeriod: Period;
  checkOutHandler: (data: CheckOutData) => void;
}

interface CheckOutData {
  amount: number;
  itemName: string;
  period: Period;
}

const PlanList: React.FC<PlanListProps> = React.memo(({ selectedPeriod, checkOutHandler }) => {
  const user = useUser();
  const calculateFinalAmount = (price: number, period: Period) => {
    switch (period) {
      case 'quarterly':
        return price * 3;
      case 'halfYearly':
        return price * 6;
      case 'yearly':
        return price * 12;
      default:
        return price;
    }
  };

  return (
    <section className="grid mt-3 gap-6 lg:grid-cols-1">
      {plans.map((item) => {
        const finalAmount = calculateFinalAmount(Number(item.prices[selectedPeriod]), selectedPeriod);

        return (
          <Card key={item.name} className="flex flex-col p-2 border-2 border-green-200">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-green-600">{item.name}</CardTitle>
                {item.isPopular && (
                  <Badge variant="default" className="bg-green-600 text-white">
                    🎉 FREE FOREVER
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="text-4xl font-extrabold text-green-600">
                  FREE
                  <span className="text-sm font-normal text-muted-foreground ml-1">forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    No Payment Required
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {item.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="shrink-0 rounded-full bg-green-600 p-1 text-white">
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => checkOutHandler({ amount: finalAmount, itemName: item.name, period: selectedPeriod })}
                disabled={!!(user?.user.premiumType && user.user.premiumType !== item.name)}
              >
                Activate Free Plan
                <span className="sr-only">Activate Free Plan</span>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </section>
  );
});

export default function Note() {
  return (
    <Card className="w-full border-l-4 border-l-green-400">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <InfoIcon className="h-5 w-5 text-green-500" />
        <CardTitle className="text-lg font-semibold">🎉 Everything is FREE!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Ved Analytics is completely free! No subscriptions, no payments, no hidden fees. 
          Enjoy unlimited access to all analytics features including unlimited websites, 
          advanced analytics, real-time data, and priority support. Start tracking your 
          websites today without any cost!
        </p>
      </CardContent>
    </Card>
  );
}

export async function Billing() {
  const user = useUser();
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period>('yearly');

  // Removed Razorpay script loading - no longer needed

  const checkOutHandler = useCallback(
    async ({ amount, itemName, period }: CheckOutData) => {
      try {
        // Free subscription - no payment required
        const verificationData = {
          userId: user?.user.userId,
          itemName: itemName,
          period: period,
        };

        const { data } = await axios.post(
          'http://localhost:3001/api/subscription/paymentVerification',
          verificationData
        );

        if (data.success) {
          let monthsToAdd = 0;
          switch (period) {
            case 'monthly':
              monthsToAdd = 1;
              break;
            case 'quarterly':
              monthsToAdd = 3;
              break;
            case 'halfYearly':
              monthsToAdd = 6;
              break;
            case 'yearly':
              monthsToAdd = 12;
              break;
            default:
              return 'Invalid period';
          }
          
          user?.setUser({
            userId: user.user.userId,
            premiumType: itemName,
            avatar: user.user.avatar,
            freeTrialDate: null,
            isFreeTrial: false,
            isPremium: true,
            premiumDate: user.user.premiumDate
              ? addMonths(new Date(user.user.premiumDate), monthsToAdd)
              : addMonths(new Date(), monthsToAdd),
          });
          
          // Show success message
          alert('Free plan activated successfully! Enjoy all features.');
        } else {
          alert('Failed to activate plan. Please try again.');
        }
      } catch (error) {
        console.error('Subscription error:', error);
        alert('An error occurred. Please try again.');
      }
    },
    [user?.user.userId, user?.user.avatar]
  );

  return (
    <>
      <section>
        <Card className="space-y-1 p-8">
          <h3 className="text-lg font-semibold sm:text-xl">
            {user?.user.isPremium
              ? 'Free Plan Active'
              : user?.user.isFreeTrial
                ? 'Free Trial'
                : 'Welcome to Ved Analytics!'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {user?.user.isPremium ? (
              <div>
                Your Free plan is active! Enjoy unlimited access to all features for 10 years.
                <br></br>
                <span className="text-green-600 font-semibold">🎉 All features are completely FREE!</span>
              </div>
            ) : user?.user.isFreeTrial ? (
              `Your free trial expires in ${Math.floor(
                (new Date(user?.user.freeTrialDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )} days. Activate the free plan to continue!`
            ) : (
              <div>
                Get started with our completely free analytics platform!
                <br></br>
                <span className="text-green-600 font-semibold">🎉 No payment required - All features are FREE for 10 years!</span>
              </div>
            )}
          </p>
        </Card>
      </section>
      <PlanList selectedPeriod={selectedPeriod} checkOutHandler={checkOutHandler} />
      <Note />
    </>
  );
}
