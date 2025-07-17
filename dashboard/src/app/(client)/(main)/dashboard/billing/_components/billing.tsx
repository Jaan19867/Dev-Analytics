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
    name: 'Starter',
    description: 'Best for individual businesses and students',
    prices: {
      monthly: '5',
      quarterly: '4.75',
      halfYearly: '4.5',
      yearly: '4.25',
    },
    originalPrices: {
      monthly: '5',
      quarterly: '5',
      halfYearly: '5',
      yearly: '5',
    },
    features: ['3 websites', 'Unlimited Analytics', 'Community Support'],
  },
  {
    name: 'Premium',
    description: 'Best for SAAS and Seasoned Founders',
    prices: {
      monthly: '20',
      quarterly: '19',
      halfYearly: '17',
      yearly: '16',
    },
    originalPrices: {
      monthly: '20',
      quarterly: '20',
      halfYearly: '20',
      yearly: '20',
    },
    isPopular: true,
    features: ['Unlimited websites', 'Advanced analytics', 'Priority support'],
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
    <section className="grid mt-3 gap-6 lg:grid-cols-2">
      {plans.map((item) => {
        const finalAmount = calculateFinalAmount(Number(item.prices[selectedPeriod]), selectedPeriod);

        return (
          <Card key={item.name} className="flex flex-col p-2">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
                {item.isPopular && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="text-4xl font-extrabold text-primary">
                  ${item.prices[selectedPeriod]}
                  <span className="text-sm font-normal text-muted-foreground ml-1">/month billed {selectedPeriod}</span>
                </div>
                {item.prices[selectedPeriod] !== item.originalPrices[selectedPeriod] && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-muted-foreground line-through">
                      ${item.originalPrices[selectedPeriod]}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      Save{' '}
                      {Math.round(
                        (1 - Number(item.prices[selectedPeriod]) / Number(item.originalPrices[selectedPeriod])) * 100
                      )}
                      %
                    </Badge>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {item.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="shrink-0 rounded-full bg-primary p-1 text-primary-foreground">
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                className="w-full"
                onClick={() => checkOutHandler({ amount: finalAmount, itemName: item.name, period: selectedPeriod })}
                disabled={!!(user?.user.premiumType && user.user.premiumType !== item.name)}
              >
                Subscribe Now @ ${finalAmount}
                <span className="sr-only">Subscribe Now @ ${finalAmount}</span>
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
        <CardTitle className="text-lg font-semibold">We hate subscriptions !</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          These are one time payment and not a subscriptions! You won't be charged a penny after the plan you purchased.
          You can renew the plan by simply repurchasing a new plan whenever you want. Don't worry, we would notify you
          when your plan is getting expired so you don't have to remember.
        </p>
      </CardContent>
    </Card>
  );
}

export async function Billing() {
  const user = useUser();
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period>('monthly');

  useEffect(() => {
    const loadRazorpayScript = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      } catch (error) {
        console.error('Failed to load Razorpay Script: ', error);
      }
    };
    loadRazorpayScript();
  }, []);

  const checkOutHandler = useCallback(
    async ({ amount, itemName, period }: CheckOutData) => {
      let finalAmount = amount;

      if (period === 'quarterly') {
        finalAmount *= 3;
      } else if (period === 'halfYearly') {
        finalAmount *= 6;
      } else if (period === 'yearly') {
        finalAmount *= 12;
      }

      const {
        data: { key },
      } = await axios.get('https://backend.vedanalytics.in/api/subscription/getKey');

      const {
        data: { response },
      } = await axios.post('https://backend.vedanalytics.in/api/subscription/createSubscription', {
        amount: amount,
        currency: 'USD',
      });

      const options = {
        key: key,
        amount: response.amount,
        currency: 'USD',
        name: user?.user.userId || '',
        description: `Purchase of ${itemName} (${period})`,
        image: user?.user.avatar || '',
        order_id: response.id,
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#121212',
        },
        handler: async function (response: {
          razorpay_order_id: any;
          razorpay_payment_id: any;
          razorpay_signature: any;
        }) {
          const verificationData = {
            userId: user?.user.userId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            itemName: itemName,
            period: period,
          };

          const { data } = await axios.post(
            'https://backend.vedanalytics.in/api/subscription/paymentVerification',
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
          } else {
            // Handle failure
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    },
    [user?.user.userId, user?.user.avatar]
  );

  return (
    <>
      <section>
        <Card className="space-y-1 p-8">
          <h3 className="text-lg font-semibold sm:text-xl">
            {user?.user.isPremium
              ? 'Premium'
              : user?.user.isFreeTrial
                ? 'Free Trial'
                : 'Please select a plan to continue your services!'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {user?.user.isPremium ? (
              <div>
                Your {user.user.premiumType} subscription expires in{' '}
                {Math.floor((new Date(user?.user.premiumDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days!
                Thanks :)
                <br></br>
                {user.user.premiumType === 'Premium' ? (
                  ' Incase you want to switch to Starter, you can switch back after your Premium Subscription is expired. If you want to add time to your Premium Subscription, you can just make another purchase and time would automatically stack up.'
                ) : (
                  <div>
                    Incase you want to switch to Premium Plan, just drop us a mail at{' '}
                    <a href="mailto:shubh622005@gmail.com" className="text-primary underline">
                      shubh622005@gmail.com
                    </a>
                    . If you want to add time to your Starter Subscription, you can just make another purchase and time
                    would automatically stack up.
                  </div>
                )}
              </div>
            ) : user?.user.isFreeTrial ? (
              `Your free trial expires in ${Math.floor(
                (new Date(user?.user.freeTrialDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )} days. Select a plan if you wish to continue!`
            ) : (
              'Your free trial has expired. Choose one of the plans below that best fits you.'
            )}
          </p>
        </Card>
      </section>
      <PeriodSelection selectedPeriod={selectedPeriod} onSelectPeriod={setSelectedPeriod} />
      <PlanList selectedPeriod={selectedPeriod} checkOutHandler={checkOutHandler} />
      <Note />
    </>
  );
}
