export interface Master {
    id: string;
    firstName: string;
    lastName: string;
    profession: string;
    region: string;
    district: string;
    phone: string;
    rating: number;
    reviewCount: number;
    experience: number; // years
    availability: {
        days: string[]; // e.g., ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        hours: string; // e.g., '09:00 - 18:00'
    };
    portfolio: {
        images: string[];
        videos: string[];
    };
    bio: string;
}

export const mockMasters: Master[] = [
    {
        id: '1',
        firstName: 'Aziz',
        lastName: 'Rahimov',
        profession: 'plumbing',
        region: 'Toshkent',
        district: 'Chilonzor',
        phone: '+998 90 123 45 67',
        rating: 4.8,
        reviewCount: 124,
        experience: 5,
        availability: {
            days: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
            hours: '08:00 - 19:00'
        },
        portfolio: {
            images: [
                '/images/portfolio/plumbing1.jpg',
                '/images/portfolio/plumbing2.jpg',
                '/images/portfolio/plumbing3.jpg'
            ],
            videos: []
        },
        bio: 'Tajribali santexnik, barcha turdagi santexnika ishlarini sifatli bajaraman. 5 yillik tajriba.'
    },
    {
        id: '2',
        firstName: 'Jamshid',
        lastName: 'Karimov',
        profession: 'electrical',
        region: 'Toshkent',
        district: 'Yunusobod',
        phone: '+998 93 987 65 43',
        rating: 4.9,
        reviewCount: 89,
        experience: 7,
        availability: {
            days: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
            hours: '09:00 - 18:00'
        },
        portfolio: {
            images: [
                '/images/portfolio/electric1.jpg',
                '/images/portfolio/electric2.jpg'
            ],
            videos: []
        },
        bio: 'Professional elektrik. Montaj, ta\'mirlash va yangi tizimlarni o\'rnatish.'
    },
    {
        id: '3',
        firstName: 'Dilshod',
        lastName: 'Nazarov',
        profession: 'repair',
        region: 'Toshkent',
        district: 'Mirzo Ulug\'bek',
        phone: '+998 97 111 22 33',
        rating: 4.7,
        reviewCount: 56,
        experience: 4,
        availability: {
            days: ['Har kuni'],
            hours: '08:00 - 20:00'
        },
        portfolio: {
            images: [
                '/images/portfolio/repair1.jpg'
            ],
            videos: []
        },
        bio: 'Maishiy texnika ta\'mirlash ustasi. Kir yuvish mashinasi, muzlatgich va konditsionerlar.'
    },
    {
        id: '4',
        firstName: 'Sardor',
        lastName: 'Aliyev',
        profession: 'cleaning',
        region: 'Toshkent',
        district: 'Yakkasaroy',
        phone: '+998 99 555 44 33',
        rating: 4.6,
        reviewCount: 210,
        experience: 3,
        availability: {
            days: ['Dushanba', 'Chorshanba', 'Juma'],
            hours: '10:00 - 16:00'
        },
        portfolio: {
            images: [],
            videos: []
        },
        bio: 'Tozalash xizmatlari. Uylar, ofislar va gilamlarni tozalash.'
    }
];
