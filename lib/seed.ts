import type { SeedData } from "./types";


export const SEED: SeedData = {
  settings: {
    businessName: "Keogh's Adventures",
    legalName: "Keogh's Adventures PTY LTD",
    owner: "Tony Keogh",
    phone: "+61 402 413 849",
    email: "tony@keoghsadventures.com",
    location: "Perth, Western Australia",
    abn: "00 000 000 000",
    announcement: "Canning Stock Route, June 2027: <b>7 seats left</b>",
    announcementOn: true,
    heroTitle: "Where the bitumen ends, the <em>adventure</em> begins.",
    heroSub: "Small-group 4WD tours across the Canning, the Kimberley and the wild south coast. Bring your own rig, or ride with Tony.",
    tagline: "Tag along & ride onboard tours to the most iconic destinations",
    depositPercent: 25,
    balanceDueDays: 60,
    maxGroup: 6,
    currency: "AUD",
    brandColor: "#FF6A00",
    facebook: "https://facebook.com/keoghsadventures",
    instagram: "https://instagram.com/keoghsadventures",
    notifyNewBooking: true, notifyBalanceDue: true, notifyEnquiry: true, notifyLowSeats: true,
    reminderDays: 14,
    stripeMode: "live",
    stripeConnected: true
  },

  tours: [
    {
      id: "csr-s2n-2027", code: "WT-1341", name: "Canning Stock Route — South to North",
      short: "Canning Stock Route", region: "Canning Stock Route", types: ["ride","tag"],
      days: 18, nights: 17, price: { tag: 5650, ride: 8950 },
      distanceKm: 1850, fuelRangeKm: 1050, difficulty: "Expedition", startEnd: "Wiluna → Halls Creek",
      activities: ["4WD","Camping","History","Photography","Stargazing"],
      cover: "/img/canning-convoy.jpg", images: ["/img/canning-convoy.jpg","/img/canning-red-dune.jpg","/img/canning-track.jpg","/img/canning-ranges.jpg","/img/pilbara-ranges-aerial.jpg","/img/wolfe-creek-crater.jpg"],
      published: true, featured: true,
      summary: "Join us for the ADVENTURE of a lifetime as we explore the world's longest and most historical stock route on this 18 day expedition from Wiluna to Halls Creek.",
      description: "The Canning Stock Route is the longest historic stock route in the world: 1,850 km of desert track, 51 wells, and somewhere around 900 sand dunes between Wiluna and Halls Creek. There is no fuel for roughly 1,050 km, no phone signal, and no one else out there but us. That is exactly the point.\n\nWe travel as a small convoy. Tony leads in the Keogh's Adventures Patrol with Starlink, a satellite phone and a full recovery kit. You drive your own prepared 4WD (tag-along) or ride with us (ride-onboard) and we handle route-finding, dune technique, well stops, permits and the nightly camp.",
      highlights: ["Durba Springs and the Calvert Ranges","Well 33 Kunawarritji — the only fuel on the route","Breaden Hills and Godfrey's Tank","Camp under a sky with zero light pollution","Cross 900+ dunes — we teach you how","Lake Disappointment at sunrise"],
      itinerary: [
        { day: 1, title: "Wiluna", text: "Meet at the Wiluna caravan park for vehicle checks, a route briefing and the first group dinner. Last fuel and phone signal for a long while." },
        { day: 2, title: "Well 2A to Well 5", text: "Into the desert proper. We practise dune approach and tyre pressures on the first soft sections and camp at Well 5." },
        { day: 3, title: "Weld Spring (Well 9)", text: "Forrest's 1874 stone fort and a permanent spring. Short day, long campfire." },
        { day: 4, title: "Well 12 to Durba Springs", text: "The dunes begin in earnest. Durba is an oasis: a palm-lined gorge with rock art and shade." },
        { day: 5, title: "Durba Springs rest day", text: "Walk the gorge, swim if the pools are up, service the vehicles." },
        { day: 6, title: "Lake Disappointment", text: "Skirt the salt lake at sunrise. Camp at Well 17 among the desert oaks." },
        { day: 7, title: "Calvert Range", text: "Side trip to one of the finest Aboriginal rock art galleries on the route." },
        { day: 8, title: "Well 23 to Well 26", text: "Long dune day. Convoy discipline matters here; Tony calls every crest on the UHF." },
        { day: 9, title: "Kunawarritji (Well 33)", text: "Fuel, a shower, and a community store. The halfway mark." },
        { day: 10, title: "Well 35 to Well 38", text: "Spinifex country and some of the biggest dunes on the route." },
        { day: 11, title: "Well 41 and the Wolfe Creek turn", text: "Historic grave sites and the hardest sand of the trip." },
        { day: 12, title: "Breaden Hills", text: "Godfrey's Tank and the Breaden Pool. Big country, big sky." },
        { day: 13, title: "Well 46 to Well 49", text: "The dunes ease off and the track opens up." },
        { day: 14, title: "Well 51 (Weriaddo)", text: "Last of the wells. A quiet night to take it all in." },
        { day: 15, title: "Billiluna", text: "Back onto the Tanami. Fuel and a community welcome." },
        { day: 16, title: "Wolfe Creek Crater", text: "Walk the rim of the second-largest meteorite crater on Earth. Camp at the crater." },
        { day: 17, title: "Halls Creek", text: "A hotel bed, a hot shower and the celebration dinner." },
        { day: 18, title: "Farewell", text: "Pack-up and goodbyes. Many guests continue north to the Kimberley." }
      ],
      inclusions: ["Full trip planning, lead vehicle and guide for the whole trip","All permits (CSR permit, Aboriginal land permits, Parks pass)","Camp fees and community fees","Starlink access each evening","Satellite phone and first-aid cover for the convoy","Celebration dinner in Halls Creek","Welcome merchandise pack per booking","Ride Onboard: all meals, camping gear, bedding and airport transfers"],
      exclusions: ["Fuel for your own vehicle (allow for 1,050 km without fuel)","Meals not listed (tag-along guests self-cater)","Personal travel insurance (strongly recommended)","Isolated vehicle recovery insurance","Alcohol (dry communities apply at Kunawarritji and Billiluna)"],
      requirements: ["4WD with low range and high ground clearance (not AWD)","LT-rated all-terrain tyres minimum, with 2 spares","Upgraded suspension and rated recovery points","Long-range fuel: minimum 1,050 km off-road range","UHF radio, minimum 5 watt, fitted","Vehicle inspection within 2 weeks before departure (Outback Service Check)","Sand flag, air compressor and tyre deflator","Minimum spares list supplied on booking"],
      departures: [
        { id: "d-csr-2027-06", date: "2027-06-14", seats: 10, booked: 3, status: "open", note: "South to North" }
      ]
    },
    {
      id: "csr-jimny-2027", code: "WT-1247", name: "Canning Stock Route — Suzuki Jimny Desert Adventure",
      short: "Jimny Desert Adventure", region: "Canning Stock Route", types: ["tag"],
      days: 18, nights: 17, price: { tag: 5650, ride: null },
      distanceKm: 1850, fuelRangeKm: 1050, difficulty: "Expedition", startEnd: "Wiluna → Halls Creek",
      activities: ["4WD","Camping","Jimny owners","Photography"],
      cover: "/img/canning-track.jpg", images: ["/img/canning-track.jpg","/img/canning-ranges.jpg","/img/canning-red-dune.jpg","/img/pilbara-ranges-aerial.jpg"],
      published: true, featured: false,
      summary: "A Jimny-only convoy across the Canning. Small cars, big dunes, and a route plan built around Jimny fuel range and payload.",
      description: "The little Suzuki is a dune weapon. This departure is built for Jimny owners only: a fuel drop plan that respects the Jimny's range, a packing list that respects its payload, and a convoy pace that lets you enjoy every crest.",
      highlights: ["Jimny-only convoy (max 10 cars)","Fuel drop arranged at Well 23","Durba Springs rest day","Kunawarritji community stop","Wolfe Creek Crater finale"],
      itinerary: [
        { day: 1, title: "Wiluna", text: "Meet, vehicle check and briefing. Weigh-in for every Jimny." },
        { day: 2, title: "Well 5", text: "First dunes and tyre pressure practice." },
        { day: 4, title: "Durba Springs", text: "Oasis camp for two nights." },
        { day: 9, title: "Kunawarritji", text: "Fuel and a shower at Well 33." },
        { day: 16, title: "Wolfe Creek Crater", text: "Walk the rim, camp on the edge." },
        { day: 18, title: "Halls Creek", text: "Celebration dinner and farewells." }
      ],
      inclusions: ["Guide, lead vehicle and support trailer","Fuel drop at Well 23 (fuel at cost)","All permits and camp fees","Starlink each evening","Welcome pack"],
      exclusions: ["Your own fuel and food","Travel insurance","Vehicle recovery insurance"],
      requirements: ["Suzuki Jimny (any generation) in good mechanical order","All-terrain tyres plus 2 spares","Long-range tank or jerry cans for 600 km","UHF radio, 5 watt","Outback Service Check within 2 weeks of departure"],
      departures: [ { id: "d-jimny-2027-06", date: "2027-06-14", seats: 10, booked: 0, status: "open", note: "Jimny only" } ]
    },
    {
      id: "csr-n2s-2027", code: "WT-1244", name: "Canning Stock Route — North to South",
      short: "Canning Stock Route N→S", region: "Canning Stock Route", types: ["ride","tag"],
      days: 21, nights: 20, price: { tag: 5650, ride: 9450 },
      distanceKm: 1850, fuelRangeKm: 1050, difficulty: "Expedition", startEnd: "Halls Creek → Wiluna",
      activities: ["4WD","Camping","History","Stargazing"],
      cover: "/img/canning-ranges.jpg", images: ["/img/canning-ranges.jpg","/img/canning-convoy.jpg","/img/wolfe-creek-crater.jpg","/img/pilbara-ranges-aerial.jpg"],
      published: true, featured: true,
      summary: "21 day desert adventure running the Canning the 'hard way', north to south, with the dunes against you. Ride-onboard seats available; tag-along is waitlist only.",
      description: "Running north to south means the steep faces of the dunes are on your approach. It is the more demanding direction and a favourite with returning guests. Three extra days give us time for Wolfe Creek, the Breaden Hills and a second night at Durba Springs.",
      highlights: ["Wolfe Creek Crater on day 2","Breaden Hills and Godfrey's Tank","Two nights at Durba Springs","Finish at Wiluna with a hotel night"],
      itinerary: [
        { day: 1, title: "Halls Creek", text: "Meet, briefing, group dinner." },
        { day: 2, title: "Wolfe Creek Crater", text: "Rim walk and crater camp." },
        { day: 5, title: "Well 46", text: "Into the big dunes." },
        { day: 10, title: "Kunawarritji", text: "Fuel, shower, community store." },
        { day: 16, title: "Durba Springs", text: "Two nights in the oasis." },
        { day: 21, title: "Wiluna", text: "Celebration dinner and farewell." }
      ],
      inclusions: ["Guide and lead vehicle","All permits and camp fees","Starlink and satellite phone","Celebration dinner","Ride Onboard: meals, camping gear, bedding, transfers"],
      exclusions: ["Own fuel and food (tag-along)","Travel and recovery insurance","Alcohol"],
      requirements: ["4WD with low range","LT all-terrain tyres, 2 spares","1,050 km fuel range","UHF 5 watt fitted","Outback Service Check"],
      departures: [ { id: "d-csr-n2s-2027-07", date: "2027-07-05", seats: 6, booked: 4, status: "open", note: "Tag-along waitlist only" } ]
    },
    {
      id: "kimberley-2027", code: "WT-1231", name: "Kimberley Adventure 2027",
      short: "Kimberley Adventure", region: "Gibb River Road & Kimberley", types: ["ride","tag"],
      days: 16, nights: 15, price: { tag: 5350, ride: 8450 },
      distanceKm: 2400, fuelRangeKm: 350, difficulty: "Moderate", startEnd: "Broome → Broome",
      activities: ["4WD","Aboriginal art","Hiking","Swimming","Sightseeing","Wildflowers"],
      cover: "/img/mitchell-falls.jpg", images: ["/img/mitchell-falls.jpg","/img/emma-gorge-falls.jpg","/img/manning-gorge.jpg","/img/windjana-gorge.jpg","/img/lake-argyle-sunset-swim.jpg","/img/bungle-bungles-chasm.jpg","/img/tunnel-creek-wading.jpg","/img/mitchell-falls-helicopter.jpg","/img/kimberley-waterfall.jpg"],
      published: true, featured: true,
      summary: "Join me for the 16 day ADVENTURE of a lifetime as we explore the hidden Kimberley. Gibb River Road, Mitchell Falls, Lake Argyle, the Bungle Bungles, Wolfe Creek and Mimbi Caves.",
      description: "Sixteen days from Broome and back through the heart of the Kimberley. We run the full Gibb River Road with every gorge worth the walk, head up to Mitchell Falls, float in Lake Argyle at sunset, walk the Bungle Bungles, stand on the rim of Wolfe Creek Crater and finish with the Gooniyandi people at Mimbi Caves.\n\nA 12-day Gibb River Road option is available if you need to be back sooner.",
      highlights: ["Tunnel Creek and Windjana Gorge","Bell, Manning, Adcock and Galvans gorges","Mitchell Falls (optional helicopter)","Wanjina Gwion rock art at Munurru","Lake Argyle infinity pool sundowner","Purnululu's Bungle Bungles","Wolfe Creek Crater rim walk","Mimbi Caves Dreaming tour"],
      itinerary: [
        { day: 1, title: "Broome", text: "Pre-tour meetup, Cable Beach sundowner and group dinner." },
        { day: 2, title: "Birdwood Downs Station", text: "Drive to Derby, visit the Boab Prison Tree and Mowanjum Art and Cultural Centre." },
        { day: 3, title: "Tunnel Creek & Windjana Gorge", text: "Walk and swim through Tunnel Creek (torch and reef shoes), then the freshwater crocs of Windjana." },
        { day: 4, title: "Bell Gorge", text: "Waterfalls and a swim at the lower pool, plus Adcock and Galvans gorges. Camp at Manning." },
        { day: 5, title: "Manning Gorge", text: "Hike across Manning Creek to the gorge. Burgers at Mt Barnett Roadhouse. Camp at Mount Elizabeth Station." },
        { day: 6, title: "Mount Elizabeth", text: "Wunnamurra and Warla gorges, cross the Gibb River, overnight at Drysdale." },
        { day: 7, title: "Munurru / King Edward River", text: "Guided Wanjina Gwion rock art visit. Camp on the river." },
        { day: 8, title: "Mitchell Falls", text: "Hike to the falls or take the optional helicopter. Return to camp." },
        { day: 9, title: "Ellenbrae & Home Valley", text: "Scones at Ellenbrae Station, camp and group dinner at Home Valley." },
        { day: 10, title: "Pentecost River & El Questro", text: "The famous crossing, El Questro Gorge, camp at the station." },
        { day: 11, title: "Kununurra", text: "Zebedee warm springs, Emma Gorge hike and swim. Kimberleyland Waterfront Holiday Park." },
        { day: 12, title: "Lake Argyle", text: "Infinity pool, guided sundowner cruise and a swim in the lake." },
        { day: 13, title: "Bungle Bungles", text: "Purnululu National Park: sandstone domes, Cathedral Gorge and Echidna Chasm." },
        { day: 14, title: "Bungle Bungles & Wolfe Creek", text: "Morning in the park, then overnight camp at Wolfe Creek Crater." },
        { day: 15, title: "Wolfe Creek & Mimbi Caves", text: "Crater rim walk, then the guided Dreaming stories tour with the Gooniyandi people." },
        { day: 16, title: "Return to Broome", text: "Drive back to Broome for a farewell drink at Cable Beach." }
      ],
      inclusions: ["Full trip planning, lead vehicle and guide for the whole trip","Camping for the start and end nights in Broome, with dinner","Five evening meals, plus lunch at Mt Barnett Roadhouse","Camp bookings, fees and permits (except the national park pass)","Wanjina Gwion rock art tour","All tour fees (except the optional Mitchell Falls helicopter)","Starlink access each evening","Ride Onboard: breakfast, lunch and dinner with alcohol on the Gibb, camping gear and bedding","Airport pickup and drop-off for Ride Onboard guests","Welcome merchandise pack per booking"],
      exclusions: ["Meals and accommodation not listed above","Camping fees not listed above","Optional Mitchell Falls helicopter (about $199 one way)","Personal travel insurance (recommended)","Isolated vehicle recovery insurance","National Park Pass (buy online; RAC members get a discount)"],
      requirements: ["4WD (not AWD) with low and high range and good ground clearance","LT-rated all-terrain tyres minimum, preferably 2 spares","Upgraded suspension","Rated recovery points (factory hooks not accepted)","UHF radio, minimum 5 watt, fitted preferred","Vehicle inspection within 2 weeks before the trip","Ability to air down and air up tyres","Snorkel recommended but not compulsory"],
      departures: [
        { id: "d-kim-2027-05a", date: "2027-05-05", seats: 6, booked: 5, status: "open", note: "" },
        { id: "d-kim-2027-05b", date: "2027-05-25", seats: 6, booked: 2, status: "open", note: "" },
        { id: "d-kim-2027-07", date: "2027-07-31", seats: 6, booked: 6, status: "full", note: "Waitlist" }
      ]
    },
    {
      id: "gibb-2027", code: "WT-1253", name: "Gibb River Road — Kimberley Tour 2027",
      short: "Gibb River Road", region: "Gibb River Road & Kimberley", types: ["ride","tag"],
      days: 12, nights: 11, price: { tag: 4350, ride: 6950 },
      distanceKm: 1500, fuelRangeKm: 350, difficulty: "Moderate", startEnd: "Broome → Kununurra",
      activities: ["4WD","Hiking","Swimming","Aboriginal art"],
      cover: "/img/manning-gorge.jpg", images: ["/img/manning-gorge.jpg","/img/windjana-gorge.jpg","/img/bell-gorge.jpg","/img/galvans-gorge-swim.jpg","/img/tunnel-creek-entrance.jpg","/img/emma-gorge-falls.jpg"],
      published: true, featured: false,
      summary: "Join us for the 12 day ADVENTURE of a lifetime as we explore The Kimberley along the Gibb River Road, Broome to Kununurra and Lake Argyle.",
      description: "The classic Gibb: 660 km of red dirt between Derby and Kununurra, and every gorge along it. This is the first 12 days of the Kimberley Adventure for guests who need to be home sooner.",
      highlights: ["Tunnel Creek and Windjana Gorge","Bell and Manning gorges","Mitchell Falls","Pentecost River crossing","Lake Argyle sundowner"],
      itinerary: [
        { day: 1, title: "Broome", text: "Meet, Cable Beach sundowner and dinner." },
        { day: 3, title: "Tunnel Creek & Windjana", text: "Swim the tunnel, walk the gorge." },
        { day: 4, title: "Bell Gorge", text: "The Gibb's postcard waterfall." },
        { day: 8, title: "Mitchell Falls", text: "Hike or helicopter." },
        { day: 10, title: "El Questro", text: "Pentecost crossing and the station." },
        { day: 12, title: "Lake Argyle", text: "Sundowner cruise and farewell." }
      ],
      inclusions: ["Guide and lead vehicle","Start and end night camping with dinner","Camp bookings and permits","Rock art tour","Starlink each evening","Ride Onboard: all meals, gear, bedding, transfers"],
      exclusions: ["Meals not listed","Helicopter flight","Insurance","National Park Pass"],
      requirements: ["4WD with low range","LT all-terrain tyres","Rated recovery points","UHF 5 watt","Vehicle inspection within 2 weeks"],
      departures: [
        { id: "d-gibb-2027-05a", date: "2027-05-05", seats: 6, booked: 1, status: "open", note: "" },
        { id: "d-gibb-2027-05b", date: "2027-05-25", seats: 6, booked: 3, status: "open", note: "" },
        { id: "d-gibb-2027-07", date: "2027-07-31", seats: 6, booked: 0, status: "open", note: "" }
      ]
    },
    {
      id: "eyre-esperance-2027", code: "WT-1302", name: "Eyre to Esperance — Bight Coast Expedition",
      short: "Eyre to Esperance", region: "Eyre to Esperance", types: ["ride","tag"],
      days: 10, nights: 9, price: { tag: 3450, ride: 5450 },
      distanceKm: 1900, fuelRangeKm: 400, difficulty: "Moderate", startEnd: "Norseman → Esperance",
      activities: ["4WD","Beach driving","Whale watching","Camping"],
      cover: "/img/bunda-cliffs.jpg", images: ["/img/bunda-cliffs.jpg","/img/coastal-track.jpg","/img/beach-convoy.jpg","/img/patrol-sand-tyre.jpg"],
      published: true, featured: false,
      summary: "Ten days along the edge of the Great Australian Bight: the Nullarbor cliffs, Eyre Bird Observatory, Israelite Bay and Cape Arid, finishing on the white sand of Lucky Bay.",
      description: "The Bight coast is the wildest stretch of coastline in the state. We drop off the Nullarbor onto the old telegraph track, camp above 90-metre cliffs, watch southern right whales from Twilight Cove and thread the sand tracks of Cape Arid to Esperance.",
      highlights: ["Bunda Cliffs lookouts","Eyre Bird Observatory (historic telegraph station)","Twilight Cove whale watching (Jun–Oct)","Israelite Bay ruins","Cape Arid sand tracks","Lucky Bay finish"],
      itinerary: [
        { day: 1, title: "Norseman", text: "Meet, vehicle checks, briefing." },
        { day: 2, title: "Balladonia to Cocklebiddy", text: "Across the Nullarbor to the cliff edge." },
        { day: 3, title: "Eyre Bird Observatory", text: "Down the escarpment to the 1897 telegraph station." },
        { day: 4, title: "Twilight Cove", text: "Whales, dunes and a cliff-top camp." },
        { day: 6, title: "Israelite Bay", text: "The old telegraph track and the ruins." },
        { day: 8, title: "Cape Arid", text: "Beach and sand track driving." },
        { day: 10, title: "Esperance", text: "Lucky Bay kangaroos and the farewell dinner." }
      ],
      inclusions: ["Guide and lead vehicle","Camp fees and permits","Starlink each evening","Farewell dinner in Esperance","Ride Onboard: meals, gear, bedding"],
      exclusions: ["Own fuel and food (tag-along)","Insurance","National Park Pass"],
      requirements: ["4WD with low range","All-terrain tyres plus spare","400 km fuel range","UHF radio","Recovery points"],
      departures: [ { id: "d-eyre-2027-09", date: "2027-09-06", seats: 8, booked: 2, status: "open", note: "" } ]
    },
    {
      id: "southwest-2day", code: "WT-1310", name: "2-Day Southwest Coastal Adventure",
      short: "Southwest Coastal", region: "Southwest Coastal", types: ["ride","tag"],
      days: 2, nights: 1, price: { tag: 590, ride: 890 },
      distanceKm: 520, fuelRangeKm: 200, difficulty: "Easy", startEnd: "Pemberton → Pemberton",
      activities: ["Beach driving","Dunes","Forest","Camping"],
      cover: "/img/patrol-beach-dune.jpg", images: ["/img/patrol-beach-dune.jpg","/img/beach-convoy.jpg","/img/dunes-group.jpg","/img/patrol-sand-tyre.jpg","/img/karri-forest-emu.jpg"],
      published: true, featured: false,
      summary: "A weekend of karri forest, giant dunes and empty beaches in D'Entrecasteaux National Park. The perfect first 4WD trip.",
      description: "Yeagarup Dunes, the Warren River mouth, Callcup Hill and Windy Harbour over two days with one night camped behind the dunes. We teach sand driving from scratch, so it suits first-timers and families.",
      highlights: ["Yeagarup Dunes (10 km of moving sand)","Warren River mouth beach run","Callcup Hill descent","Windy Harbour and Salmon Beach","Campfire dinner included"],
      itinerary: [
        { day: 1, title: "Pemberton → Yeagarup", text: "Forest tracks, dune school and the beach run to the Warren River. Camp behind the dunes." },
        { day: 2, title: "Callcup → Windy Harbour", text: "Callcup Hill, Salmon Beach, lunch at Windy Harbour and the drive home." }
      ],
      inclusions: ["Guide and lead vehicle","Park entry and camp fees","Campfire dinner and breakfast","Sand driving tuition","Ride Onboard: all gear and lunches"],
      exclusions: ["Own fuel","Lunches (tag-along)"],
      requirements: ["4WD with low range","Tyre deflator and compressor","UHF radio (hire available)","Recovery points"],
      departures: [
        { id: "d-sw-2026-11", date: "2026-11-14", seats: 8, booked: 6, status: "open", note: "" },
        { id: "d-sw-2027-02", date: "2027-02-20", seats: 8, booked: 2, status: "open", note: "" },
        { id: "d-sw-2027-03", date: "2027-03-27", seats: 8, booked: 0, status: "open", note: "" }
      ]
    },
    {
      id: "pemberton-day", code: "WT-1322", name: "Pemberton Dunes & Forest Day Trip",
      short: "Pemberton Day Trip", region: "Southwest Coastal", types: ["ride","tag"],
      days: 1, nights: 0, price: { tag: 249, ride: 349 },
      distanceKm: 180, fuelRangeKm: 100, difficulty: "Easy", startEnd: "Pemberton → Pemberton",
      activities: ["Dunes","Forest","Beach"],
      cover: "/img/dunes-group.jpg", images: ["/img/dunes-group.jpg","/img/karri-forest-emu.jpg","/img/patrol-sand-tyre.jpg"],
      published: true, featured: false,
      summary: "One big day: karri forest, the Yeagarup Dunes and a beach lunch. Ideal if you want to try 4WD touring before a longer trip.",
      description: "A taster day out of Pemberton. Forest tracks in the morning, the dunes before lunch and the beach after. Ride onboard with Tony or bring your own 4WD.",
      highlights: ["Karri forest tracks","Yeagarup Dunes","Beach lunch at the Warren River mouth"],
      itinerary: [ { day: 1, title: "Pemberton loop", text: "8am start, forest, dunes, beach lunch, back by 4pm." } ],
      inclusions: ["Guide","Park entry","Lunch","Sand driving tuition"],
      exclusions: ["Own fuel (tag-along)"],
      requirements: ["4WD with low range","Tyre deflator"],
      departures: [
        { id: "d-pem-2026-10", date: "2026-10-31", seats: 8, booked: 5, status: "open", note: "" },
        { id: "d-pem-2026-11", date: "2026-11-28", seats: 8, booked: 1, status: "open", note: "" },
        { id: "d-pem-2027-01", date: "2027-01-16", seats: 8, booked: 0, status: "open", note: "" }
      ]
    }
  ],

  regions: [
    { id: "Canning Stock Route", blurb: "1,850 km. 51 wells. 900 dunes.", img: "/img/pilbara-ranges-aerial.jpg" },
    { id: "Gibb River Road & Kimberley", blurb: "Gorges, falls, rock art and Lake Argyle.", img: "/img/emma-gorge-falls.jpg" },
    { id: "Eyre to Esperance", blurb: "Cliffs, whales and the Bight coast.", img: "/img/bunda-cliffs.jpg" },
    { id: "Southwest Coastal", blurb: "Dunes and karri forest, close to home.", img: "/img/patrol-beach-dune.jpg" }
  ],

  customers: [
    { id: "c1", name: "Mark & Jenny Harrington", email: "mark.harrington@example.com", phone: "+61 412 000 101", city: "Mandurah WA", vehicle: "Toyota LandCruiser 79", trips: 2, since: "2025-02-11", notes: "Returning guests. Did CSR 2025." },
    { id: "c2", name: "Priya Nair", email: "priya.nair@example.com", phone: "+61 433 000 102", city: "Fremantle WA", vehicle: "—", trips: 1, since: "2026-03-02", notes: "Ride onboard. Vegetarian." },
    { id: "c3", name: "Dave Whitlock", email: "dave.w@example.com", phone: "+61 400 000 103", city: "Bunbury WA", vehicle: "Ford Ranger Raptor", trips: 3, since: "2024-11-20", notes: "" },
    { id: "c4", name: "Sue & Graham Pollard", email: "pollards@example.com", phone: "+61 418 000 104", city: "Albany WA", vehicle: "Nissan Patrol Y62", trips: 1, since: "2026-05-14", notes: "" },
    { id: "c5", name: "Liam O'Connor", email: "liam.oc@example.com", phone: "+61 421 000 105", city: "Melbourne VIC", vehicle: "—", trips: 0, since: "2026-09-30", notes: "Flying in. Ride onboard." },
    { id: "c6", name: "Hannah Becker", email: "hannah.b@example.com", phone: "+61 455 000 106", city: "Perth WA", vehicle: "Suzuki Jimny JB74", trips: 1, since: "2026-01-08", notes: "" },
    { id: "c7", name: "The Tran family", email: "tran.family@example.com", phone: "+61 402 000 107", city: "Joondalup WA", vehicle: "Isuzu MU-X", trips: 0, since: "2026-10-02", notes: "Two kids, 9 and 12." },
    { id: "c8", name: "Rob Castellano", email: "rob.c@example.com", phone: "+61 411 000 108", city: "Geraldton WA", vehicle: "Toyota Prado 150", trips: 1, since: "2025-08-19", notes: "" }
  ],

  bookings: [
    { id: "KA-2026-0412", tourId: "kimberley-2027", depId: "d-kim-2027-05a", customerId: "c1", style: "tag", guests: 2, vehicles: 1, created: "2026-09-02", status: "deposit", total: 10700, payments: [ { id: "py_1", date: "2026-09-02", amount: 2675, method: "Visa •••• 4242", status: "succeeded", stripe: "pi_3Q1aB" } ], docs: { terms: true, medical: true, vehicle: false }, consent: { privacy: "2026-09-02T09:14:00", marketing: false, terms: "23 Jan 2025" }, notes: "Second trip with us." },
    { id: "KA-2026-0418", tourId: "kimberley-2027", depId: "d-kim-2027-05a", customerId: "c2", style: "ride", guests: 1, vehicles: 0, created: "2026-09-11", status: "paid", total: 8450, payments: [ { id: "py_2", date: "2026-09-11", amount: 2112.5, method: "Mastercard •••• 8821", status: "succeeded", stripe: "pi_3Q2cD" }, { id: "py_3", date: "2026-10-09", amount: 6337.5, method: "Mastercard •••• 8821", status: "succeeded", stripe: "pi_3Q9fE" } ], docs: { terms: true, medical: true, vehicle: null }, consent: { privacy: "2026-09-11T09:14:00", marketing: false, terms: "23 Jan 2025" }, notes: "" },
    { id: "KA-2026-0421", tourId: "csr-s2n-2027", depId: "d-csr-2027-06", customerId: "c3", style: "tag", guests: 2, vehicles: 1, created: "2026-09-18", status: "deposit", total: 11300, payments: [ { id: "py_4", date: "2026-09-18", amount: 2825, method: "Visa •••• 1190", status: "succeeded", stripe: "pi_3Q4gH" } ], docs: { terms: true, medical: false, vehicle: false }, consent: { privacy: "2026-09-18T09:14:00", marketing: true, terms: "23 Jan 2025" }, notes: "" },
    { id: "KA-2026-0425", tourId: "csr-n2s-2027", depId: "d-csr-n2s-2027-07", customerId: "c4", style: "ride", guests: 2, vehicles: 0, created: "2026-09-24", status: "deposit", total: 18900, payments: [ { id: "py_5", date: "2026-09-24", amount: 4725, method: "Amex •••• 3007", status: "succeeded", stripe: "pi_3Q5jK" } ], docs: { terms: true, medical: true, vehicle: null }, consent: { privacy: "2026-09-24T09:14:00", marketing: true, terms: "23 Jan 2025" }, notes: "" },
    { id: "KA-2026-0431", tourId: "kimberley-2027", depId: "d-kim-2027-05b", customerId: "c5", style: "ride", guests: 1, vehicles: 0, created: "2026-10-01", status: "failed", total: 8450, payments: [ { id: "py_6", date: "2026-10-01", amount: 2112.5, method: "Visa •••• 0341", status: "failed", stripe: "pi_3Q7mN", error: "Card declined (insufficient funds)" } ], docs: { terms: true, medical: false, vehicle: null }, consent: { privacy: "2026-10-01T09:14:00", marketing: true, terms: "23 Jan 2025" }, notes: "Payment failed — needs a nudge." },
    { id: "KA-2026-0433", tourId: "southwest-2day", depId: "d-sw-2026-11", customerId: "c6", style: "tag", guests: 2, vehicles: 1, created: "2026-10-03", status: "paid", total: 1180, payments: [ { id: "py_7", date: "2026-10-03", amount: 1180, method: "Visa •••• 7718", status: "succeeded", stripe: "pi_3Q8pQ" } ], docs: { terms: true, medical: true, vehicle: true }, consent: { privacy: "2026-10-03T09:14:00", marketing: false, terms: "23 Jan 2025" }, notes: "" },
    { id: "KA-2026-0436", tourId: "southwest-2day", depId: "d-sw-2026-11", customerId: "c7", style: "tag", guests: 4, vehicles: 1, created: "2026-10-06", status: "paid", total: 2360, payments: [ { id: "py_8", date: "2026-10-06", amount: 2360, method: "Mastercard •••• 5520", status: "succeeded", stripe: "pi_3Q9rS" } ], docs: { terms: true, medical: true, vehicle: false }, consent: { privacy: "2026-10-06T09:14:00", marketing: false, terms: "23 Jan 2025" }, notes: "Kids 9 and 12." },
    { id: "KA-2026-0440", tourId: "pemberton-day", depId: "d-pem-2026-10", customerId: "c8", style: "tag", guests: 2, vehicles: 1, created: "2026-10-10", status: "paid", total: 498, payments: [ { id: "py_9", date: "2026-10-10", amount: 498, method: "Visa •••• 2200", status: "succeeded", stripe: "pi_3QAtU" } ], docs: { terms: true, medical: true, vehicle: true }, consent: { privacy: "2026-10-10T09:14:00", marketing: false, terms: "23 Jan 2025" }, notes: "" },
    { id: "KA-2026-0442", tourId: "csr-s2n-2027", depId: "d-csr-2027-06", customerId: "c8", style: "tag", guests: 1, vehicles: 1, created: "2026-10-12", status: "deposit", total: 5650, payments: [ { id: "py_10", date: "2026-10-12", amount: 1412.5, method: "Visa •••• 2200", status: "succeeded", stripe: "pi_3QBvW" } ], docs: { terms: true, medical: false, vehicle: false }, consent: { privacy: "2026-10-12T09:14:00", marketing: true, terms: "23 Jan 2025" }, notes: "" }
  ],



  posts: [
    { id: "p1", title: "Canning Stock Route May 2026", date: "2026-06-13", cover: "/img/canning-red-dune.jpg", excerpt: "Eighteen days, 900 dunes, zero dramas. The May convoy made it Wiluna to Halls Creek with every vehicle intact and a lot of new friendships.", body: "The May 2026 Canning was one for the books. Six vehicles, twelve guests, and the best conditions we've seen on the route in years after a wet summer: Durba Springs was full, the wells were running and the wildflowers around Well 17 were out early.\n\nSpecial mention to the Harringtons who completed their second Canning with us and to the Patrol, which pulled two recoveries without breaking a sweat. Bookings for June 2027 are open now." },
    { id: "p2", title: "Canning Stock Route 2025", date: "2025-11-25", cover: "/img/canning-convoy.jpg", excerpt: "A look back at the 2025 crossing: the convoy, the camps and the moment at Well 33 when everyone realised they were halfway.", body: "2025 was the year we introduced Starlink to the convoy and it changed the evenings completely. Guests could send a photo home from the middle of the Gibson Desert. The dunes between Well 41 and 46 were the softest we have driven; tyre pressures went to 14 psi and everyone learnt a lot about momentum." },
    { id: "p3", title: "New Tour Vehicle Success", date: "2025-11-25", cover: "/img/patrol-new.jpg", excerpt: "Meet the new Keogh's Adventures Nissan Patrol: long-range tanks, Alu-Cab canopy, Starlink and seats for ride-onboard guests.", body: "The new Patrol has been fitted out specifically for ride-onboard guests: three forward-facing seats with proper legroom, dual long-range tanks giving 1,400 km, a 95 L fridge, Alu-Cab canopy with roof-top tent for Tony, Starlink, a satellite phone and a full recovery kit. It did its first Canning in May 2026 and did not miss a beat." }
  ],

  reviews: [
    { id: "r1", name: "Mark H.", where: "Mandurah WA", stars: 5, trip: "Canning Stock Route 2025", text: "Tony calls every dune on the radio before you get to it. We'd never done sand before and by day three we felt like old hands. Best thing we've ever done." },
    { id: "r2", name: "Priya N.", where: "Fremantle WA", stars: 5, trip: "Kimberley Adventure", text: "I rode onboard because I don't own a 4WD and it was perfect. Tony cooked, I swam in gorges every day, and Lake Argyle at sunset made me cry a little." },
    { id: "r3", name: "Dave W.", where: "Bunbury WA", stars: 5, trip: "Gibb River Road", text: "Three trips with Keogh's now. Small group, no rushing, and he knows every station owner on the Gibb. The scones at Ellenbrae alone are worth it." }
  ],

  faqs: [
    { q: "What's the difference between Tag Along and Ride Onboard?", a: "Tag Along means you drive your own prepared 4WD in our convoy and we handle the route, permits, camps and support. Ride Onboard means you sit in the Keogh's Adventures vehicle with Tony: all meals, camping gear and bedding are included and you only need a backpack." },
    { q: "How much is the deposit and when is the balance due?", a: "A 25% deposit secures your seat. The balance is due 60 days before departure. We'll email you a reminder two weeks before it's due and you can pay from your account page at any time." },
    { q: "Is my vehicle suitable?", a: "For the Kimberley you need a true 4WD with low range, all-terrain tyres and rated recovery points. The Canning also needs around 1,050 km of fuel range. Every tour page lists the exact requirements, and we ask for an Outback Service Check within two weeks of departure." },
    { q: "What happens if I need to cancel?", a: "Deposits are refundable less a $250 admin fee up to 90 days before departure. Inside 90 days we'll do our best to resell your seat and refund what we can. Travel insurance is strongly recommended." },
    { q: "Do I need to be fit?", a: "You need to be able to walk a few kilometres on rough ground and climb in and out of a 4WD. Every walk has a shorter option and nobody is ever made to do anything they don't want to." },
    { q: "Can I do a private tour?", a: "Yes. Tony runs bespoke private tours for groups of friends or families. Share the cost between the group and build the itinerary you want. Use the enquiry form and tell us where you'd like to go." }
  ]
};
