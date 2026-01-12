import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CampaignData {
  id: number;
  brand: string;
  launchDate: string;
  activity: string;
  liveDate: string;
  agPrice: number | null;
  laurenFee: number | null;
  shot: string;
  complete: string;
  invoiceNo: string;
  paid: string;
  includesVat: string;
  currency: string;
  brandPOs: string;
  paymentTerms: string;
}

const campaignData: CampaignData[] = [
  {
    id: 1,
    brand: "NA-KD",
    launchDate: "JULY",
    activity: "1 x STORY SET + 1 X IG CAROUSEL (GBP)",
    liveDate: "",
    agPrice: 1400,
    laurenFee: null,
    shot: "",
    complete: "✓",
    invoiceNo: "PO-4555",
    paid: "17 Oct",
    includesVat: "NO VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 2,
    brand: "BALI BODY",
    launchDate: "JULY",
    activity: "CUSTOMS FEE (41.61 EUR)",
    liveDate: "",
    agPrice: 0,
    laurenFee: 36.2,
    shot: "",
    complete: "✓",
    invoiceNo: "PO-4542",
    paid: "17 Oct",
    includesVat: "NO VAT",
    currency: "EUR",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 3,
    brand: "BOHO MOON",
    launchDate: "AUG",
    activity: "1 X IG REEL, STORY SET + PAID USAGE (GBP)",
    liveDate: "",
    agPrice: 1100,
    laurenFee: 800,
    shot: "",
    complete: "✓",
    invoiceNo: "PO-4663",
    paid: "17 Oct",
    includesVat: "VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 4,
    brand: "KEVIN MURPHY",
    launchDate: "SEPT",
    activity: "1 X IG STORY SET (EUR) - LIVE SEPT 18th\n3 MONTH RETAINER - MONTH 1\n3 x Story set (3 Story Frames) = 1 a month\n(discount codes and links displayed)\n31 days of organic usage",
    liveDate: "",
    agPrice: 1458,
    laurenFee: 1166.66,
    shot: "",
    complete: "",
    invoiceNo: "PO-4792",
    paid: "CHASED",
    includesVat: "",
    currency: "EUR",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 5,
    brand: "BOHO MOON",
    launchDate: "SEPT",
    activity: "Provide the brand with Raw footage - LIVE 21ST",
    liveDate: "",
    agPrice: 933,
    laurenFee: 747,
    shot: "",
    complete: "",
    invoiceNo: "PO-4798",
    paid: "OCT",
    includesVat: "VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 6,
    brand: "CLUSE",
    launchDate: "OCT",
    activity: "1x IG CAROUSEL + STORY SET",
    liveDate: "",
    agPrice: 2500,
    laurenFee: 2166,
    shot: "",
    complete: "",
    invoiceNo: "PO-4923",
    paid: "",
    includesVat: "NO VAT",
    currency: "EUR",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 7,
    brand: "JS HEALTH",
    launchDate: "OCT",
    activity: "IG STORY SET",
    liveDate: "",
    agPrice: 1000,
    laurenFee: 800,
    shot: "",
    complete: "",
    invoiceNo: "PO-4924",
    paid: "",
    includesVat: "VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 8,
    brand: "COLGATE",
    launchDate: "OCT",
    activity: "UGC VIDEOS + USAGE",
    liveDate: "",
    agPrice: 2500,
    laurenFee: 2000,
    shot: "",
    complete: "AWAITING DETAILS",
    invoiceNo: "",
    paid: "",
    includesVat: "VAT",
    currency: "EUR",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 9,
    brand: "INGLOT",
    launchDate: "OCT",
    activity: "1x IG REEL, STORY SET + REMINDER\n3 MONTH RETAINER - MONTH 2\n1 x GRid post, 1 x Story Set\n31 days of organic usage\n31 days paid usage",
    liveDate: "",
    agPrice: 2700,
    laurenFee: 2160,
    shot: "",
    complete: "",
    invoiceNo: "PO-4978",
    paid: "",
    includesVat: "NO VAT",
    currency: "EUR",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 10,
    brand: "BOHO MOON",
    launchDate: "OCT",
    activity: "Provide the brand with Raw footage",
    liveDate: "",
    agPrice: 933,
    laurenFee: 747,
    shot: "",
    complete: "",
    invoiceNo: "PO-4963",
    paid: "",
    includesVat: "VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 11,
    brand: "KEVIN MURPHY",
    launchDate: "OCT",
    activity: "1 X IG REEL (EUR)\nLIVE 9TH NOV -",
    liveDate: "4th Nov",
    agPrice: 1458,
    laurenFee: 1166.66,
    shot: "",
    complete: "",
    invoiceNo: "PO-5017",
    paid: "",
    includesVat: "NO VAT",
    currency: "EUR",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 12,
    brand: "BEAUTY AND THE BUMP",
    launchDate: "NOV",
    activity: "1x IG Reel, Story Reminder Frame + 2 Stills",
    liveDate: "9th Nov",
    agPrice: 2300,
    laurenFee: 1840,
    shot: "",
    complete: "AWAITING DETAILS",
    invoiceNo: "",
    paid: "",
    includesVat: "",
    currency: "",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 13,
    brand: "RIVER ISLAND",
    launchDate: "NOV",
    activity: "1 x IG Reel, 1 x Story Set, 1x Image (brand use), +",
    liveDate: "11th Nov",
    agPrice: 3500,
    laurenFee: 2800,
    shot: "",
    complete: "",
    invoiceNo: "PO-5047",
    paid: "",
    includesVat: "VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 14,
    brand: "KEVIN MURPHY",
    launchDate: "NOV",
    activity: "1 X IG STORY SET (EUR)\n3 MONTH RETAINER - MONTH 3\n1 x IG REEL 1 x Story Set\n31 days of organic usage\n31 days paid usage",
    liveDate: "12th Nov",
    agPrice: 1458,
    laurenFee: 1166.66,
    shot: "",
    complete: "",
    invoiceNo: "PO-5058",
    paid: "",
    includesVat: "NO VAT",
    currency: "VAT",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 15,
    brand: "BOHO MOON",
    launchDate: "NOV",
    activity: "Provide the brand with Raw footage",
    liveDate: "20th Nov",
    agPrice: 933,
    laurenFee: 747,
    shot: "",
    complete: "",
    invoiceNo: "PO-5075",
    paid: "",
    includesVat: "VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 16,
    brand: "LYNOTT",
    launchDate: "NOV",
    activity: "Brown Thomas Deliverables - Reel, IG Story Set, Re post to TikTok",
    liveDate: "TBC - W/C 17th",
    agPrice: 2000,
    laurenFee: 1600,
    shot: "",
    complete: "",
    invoiceNo: "",
    paid: "",
    includesVat: "NO VAT",
    currency: "EUR",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 17,
    brand: "LOOK FANTASTIC",
    launchDate: "NOV",
    activity: "1 x IG REEL + STORY",
    liveDate: "22nd Nov",
    agPrice: 2100,
    laurenFee: 1680,
    shot: "",
    complete: "",
    invoiceNo: "",
    paid: "",
    includesVat: "",
    currency: "",
    brandPOs: "",
    paymentTerms: "",
  },
  {
    id: 18,
    brand: "JS HEALTH",
    launchDate: "DEC",
    activity: "IG STORY SET",
    liveDate: "11th Dec",
    agPrice: 1000,
    laurenFee: 800,
    shot: "",
    complete: "",
    invoiceNo: "",
    paid: "",
    includesVat: "VAT",
    currency: "GBP",
    brandPOs: "",
    paymentTerms: "",
  },
];

const CampaignTracker = () => {
  const getCompleteStyle = (complete: string) => {
    if (complete === "✓") return "bg-green-500 text-white";
    if (complete === "AWAITING DETAILS") return "bg-yellow-100 text-yellow-800";
    return "";
  };

  const getPaidStyle = (paid: string) => {
    if (paid.includes("Oct") || paid.includes("OCT")) return "bg-purple-200 text-purple-900";
    if (paid === "CHASED") return "bg-purple-500 text-white";
    return "";
  };

  return (
    <DashboardLayout title="Campaign Tracker">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search campaigns..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Brand</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Launch Date</TableHead>
                  <TableHead className="font-semibold text-foreground min-w-[200px]">Activity</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Live Date</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">AG Price</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">Lauren Fee</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Shot</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Complete</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Invoice No</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Paid</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Includes VAT</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Currency</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Brand POs</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Payment Terms</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignData.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground whitespace-nowrap">
                      {campaign.brand}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {campaign.launchDate}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px]">
                      <div className="whitespace-pre-line">{campaign.activity}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {campaign.liveDate}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground whitespace-nowrap">
                      {campaign.agPrice ? campaign.agPrice.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                      {campaign.laurenFee ? campaign.laurenFee.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {campaign.shot}
                    </TableCell>
                    <TableCell>
                      {campaign.complete && (
                        <Badge className={getCompleteStyle(campaign.complete)}>
                          {campaign.complete}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {campaign.invoiceNo}
                    </TableCell>
                    <TableCell>
                      {campaign.paid && (
                        <Badge className={getPaidStyle(campaign.paid)}>
                          {campaign.paid}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {campaign.includesVat}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {campaign.currency}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {campaign.brandPOs}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {campaign.paymentTerms}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignTracker;
