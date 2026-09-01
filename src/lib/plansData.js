import { supabase } from '@/lib/supabaseClient';

export const defaultSubscriptionPlans = [
    {
        id: 'basic',
        name: 'Starter AI',
        name_ar: 'البداية بالذكاء الاصطناعي',
        description: 'For traders exploring AI-driven chart pattern recognition and real-time market queries.',
        description_ar: 'للمتداولين الذين يستكشفون التعرف على أنماط المخططات واستفسارات السوق بالذكاء الاصطناعي.',
        price: 0,
        currency: '$',
        credits: 300,
        validity: 'Free For 1 Month',
        validity_ar: 'مجاناً لمدة شهر واحد',
        ctaText: 'Get Started Free',
        ctaText_ar: 'ابدأ مجاناً',
        ctaText_ph: 'Magsimula nang Libre',
        subCtaText: 'No credit card required',
        subCtaText_ar: 'لا تتطلب بطاقة ائتمان',
        featuresHeader: 'Included in Starter AI:',
        featuresHeader_ar: 'المميزات المضمنة في خطة البداية:',
        features: [
            '300 Monthly AI Processing Credits',
            'Multi-Timeframe Chart Analysis (15M, 1H, 4H)',
            '25 AI Chat Market Intelligence queries',
            'Real-Time Economic Calendar & Sentiment',
            'Standard AI Indicator Confluence Scoring',
            'Community Strategy Insights'
        ],
        features_ar: [
            '300 رصيد معالجة شهري بالذكاء الاصطناعي',
            'تحليل المخططات متعدد الأطر الزمنية (15 دقيقة، 1 ساعة، 4 ساعات)',
            '25 استفسار ذكاء اصطناعي لمعلومات السوق',
            'التقويم الاقتصادي ومعنويات السوق الحية',
            'تسجيل توافق المؤشرات القياسي بالذكاء الاصطناعي',
            'رؤى استراتيجيات المجتمع'
        ],
        badge: null,
        badge_ar: null,
        is_best_value: false,
        is_featured: false,
        display_order: 1
    },
    {
        id: 'standard',
        name: 'Trader Pro',
        name_ar: 'المتداول المحترف',
        description: 'Engineered for active Forex and Global traders demanding sniper accuracy and automated audits.',
        description_ar: 'مصمم لمتداولي الفوركس والأسواق العالمية الذين يطلبون دقة متناهية وتدقيقاً آلياً.',
        price: 149,
        originalPrice: 199,
        currency: '$',
        credits: 1500,
        validity: 'Valid 3 Months',
        validity_ar: 'صالح لمدة 3 أشهر',
        ctaText: 'Upgrade to Pro',
        ctaText_ar: 'الترقية إلى المحترف',
        ctaText_ph: 'Mag-upgrade sa Pro',
        subCtaText: 'Instant Activation • Full Access',
        subCtaText_ar: 'تفعيل فوري • وصول كامل',
        featuresHeader: 'Everything in Starter plus:',
        featuresHeader_ar: 'كل شيء في خطة البداية بالإضافة إلى:',
        features: [
            '1,500 AI Processing Credits',
            'Full AI Past Trade Analyzer (Win-Rate & Leak Audit)',
            'Ultra-Fast Sub-Second Pattern Detection',
            '100+ Conversational AI Chat Queries',
            'Multi-Asset Scanner (Forex, Indices, Commodities)',
            'Automated Support & Resistance Key Level Marking',
            'Custom Strategy Indicator Tuning'
        ],
        features_ar: [
            '1,500 رصيد معالجة بالذكاء الاصطناعي',
            'محلل الصفقات السابقة بالذكاء الاصطناعي بالكامل',
            'كشف فائق السرعة للأنماط في أجزاء من الثانية',
            'أكثر من 100 استفسار ذكاء اصطناعي لمحادثات السوق',
            'ماسح متعدد الأصول (فوركس، مؤشرات، سلع)',
            'تحديد مستويات الدعم والمقاومة الرئيسية آلياً',
            'ضبط مؤشرات الاستراتيجيات المخصصة'
        ],
        badge: 'MOST POPULAR',
        badge_ar: 'الأكثر شعبية',
        is_best_value: true,
        is_featured: true,
        display_order: 2
    },
    {
        id: 'premium',
        name: 'Institutional Quant',
        name_ar: 'المؤسسي الكمي',
        description: 'For prop firm traders, fund managers, and quants requiring maximum throughput and custom models.',
        description_ar: 'لمتداولي شركات التمويل ومديري الصناديق الذين يحتاجون إلى أقصى طاقة ونماذج مخصصة.',
        price: 499,
        originalPrice: 650,
        currency: '$',
        credits: 5000,
        validity: 'Valid 6 Months',
        validity_ar: 'صالح لمدة 6 أشهر',
        ctaText: 'Upgrade to Institutional',
        ctaText_ar: 'الترقية إلى المؤسسي',
        ctaText_ph: 'Mag-upgrade sa Institutional',
        subCtaText: 'Dedicated Infrastructure • Priority Routing',
        subCtaText_ar: 'بنية تحتية مخصصة • توجيه ذو أولوية',
        featuresHeader: 'Everything in Pro plus:',
        featuresHeader_ar: 'كل شيء في خطة المحترف بالإضافة إلى:',
        features: [
            '5,000 High-Speed AI Processing Credits',
            'Priority Zero-Latency Neural Inference Cloud',
            'Unlimited Strategy Backtesting & Optimizations',
            'Institutional Order Flow & Liquidity Telemetry',
            'Unlimited AI Chat & Deep Technical Screenings',
            'Custom Risk-Reward & Position Sizing Presets',
            '24/7 Dedicated Quant Support & Private Desk'
        ],
        features_ar: [
            '5,000 رصيد معالجة فائق السرعة بالذكاء الاصطناعي',
            'سحابة استدلال عصبي ذات أولوية وبدون تأخير',
            'اختبار رجعي وتحسين غير محدود للاستراتيجيات',
            'قياس تدفق الأوامر المؤسسية والسيولة',
            'استفسارات ذكاء اصطناعي وفحوصات فنية غير محدودة',
            'إعدادات مسبقة مخصصة لنسبة العائد إلى المخاطرة',
            'دعم مخصص على مدار 24/7 ومكتب خاص'
        ],
        badge: 'ELITE VIP',
        badge_ar: 'النخبة VIP',
        is_best_value: false,
        is_featured: false,
        display_order: 3
    }
];

export async function fetchSubscriptionPlans() {
    if (!supabase) {
        return defaultSubscriptionPlans;
    }
    try {
        const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) {
            return defaultSubscriptionPlans;
        }

        return data.map((plan) => ({
            ...plan,
            features: Array.isArray(plan.features) ? plan.features : (typeof plan.features === 'string' ? JSON.parse(plan.features) : []),
            features_ar: Array.isArray(plan.features_ar) ? plan.features_ar : (typeof plan.features_ar === 'string' ? JSON.parse(plan.features_ar) : []),
            features_ph: Array.isArray(plan.features_ph) ? plan.features_ph : (typeof plan.features_ph === 'string' ? JSON.parse(plan.features_ph) : [])
        }));
    } catch (_) {
        return defaultSubscriptionPlans;
    }
}
