"use client"

import { useState, useEffect } from "react"
import { FileText, MapPin, Mail, Rocket, Book, Edit, X, Save, ExternalLink, ChevronDown, ChevronUp, ChevronsUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { useTenant } from "@/contexts/tenant-context"
import { getTenantInfo, getTenantInfoWithId, updateTenantInfo, getJson, type TenantInfo } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface OrganizationInfoState extends Partial<TenantInfo> {
  name?: string
  tenantAcronym?: string
  street?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  emailAddress?: string
  website?: string
  countryName?: string
  countryId?: number
  countryISO2Code?: string
}

type ApiCountry = {
  id: string
  name: string
  iso2Code?: string | null
  isdCode?: number | null
}

type GetCountriesResponse = {
  data: {
    countries: ApiCountry[]
  }
}

export const defaultCountries =
  [
    {
      "id": 1,
      "countryName": "Afghanistan",
      "isO2Code": "AF",
      "isdCode": 93,
      "dateEntered": "2022-02-26T15:02:54.6"
    },
    {
      "id": 2,
      "countryName": "Albania",
      "isO2Code": "AL",
      "isdCode": 355,
      "dateEntered": "2022-02-26T15:02:54.6066666"
    },
    {
      "id": 3,
      "countryName": "Algeria",
      "isO2Code": "DZ",
      "isdCode": 213,
      "dateEntered": "2022-02-26T15:02:54.61"
    },
    {
      "id": 4,
      "countryName": "American Samoa",
      "isO2Code": "AS",
      "isdCode": 1684,
      "dateEntered": "2022-02-26T15:02:54.6166666"
    },
    {
      "id": 5,
      "countryName": "Andorra",
      "isO2Code": "AD",
      "isdCode": 376,
      "dateEntered": "2022-02-26T15:02:54.62"
    },
    {
      "id": 6,
      "countryName": "Angola",
      "isO2Code": "AO",
      "isdCode": 244,
      "dateEntered": "2022-02-26T15:02:54.6266666"
    },
    {
      "id": 7,
      "countryName": "Antigua and Barbuda",
      "isO2Code": "AG",
      "isdCode": 1268,
      "dateEntered": "2022-02-26T15:02:54.63"
    },
    {
      "id": 8,
      "countryName": "Argentina",
      "isO2Code": "AR",
      "isdCode": 54,
      "dateEntered": "2022-02-26T15:02:54.6366666"
    },
    {
      "id": 9,
      "countryName": "Armenia",
      "isO2Code": "AM",
      "isdCode": 374,
      "dateEntered": "2022-02-26T15:02:54.64"
    },
    {
      "id": 10,
      "countryName": "Aruba",
      "isO2Code": "AW",
      "isdCode": 297,
      "dateEntered": "2022-02-26T15:02:54.6466666"
    },
    {
      "id": 12,
      "countryName": "Australia",
      "isO2Code": "AU",
      "isdCode": 61,
      "dateEntered": "2022-02-26T15:02:54.6566666"
    },
    {
      "id": 13,
      "countryName": "Austria",
      "isO2Code": "AT",
      "isdCode": 43,
      "dateEntered": "2022-02-26T15:02:54.7233333"
    },
    {
      "id": 14,
      "countryName": "Azerbaijan",
      "isO2Code": "AZ",
      "isdCode": 994,
      "dateEntered": "2022-02-26T15:02:54.73"
    },
    {
      "id": 16,
      "countryName": "Bahrain",
      "isO2Code": "BH",
      "isdCode": 973,
      "dateEntered": "2022-02-26T15:02:54.7466666"
    },
    {
      "id": 17,
      "countryName": "Bangladesh",
      "isO2Code": "BD",
      "isdCode": 880,
      "dateEntered": "2022-02-26T15:02:54.75"
    },
    {
      "id": 18,
      "countryName": "Barbados",
      "isO2Code": "BB",
      "isdCode": 1246,
      "dateEntered": "2022-02-26T15:02:54.7566666"
    },
    {
      "id": 19,
      "countryName": "Belarus",
      "isO2Code": "BY",
      "isdCode": 375,
      "dateEntered": "2022-02-26T15:02:54.7666666"
    },
    {
      "id": 20,
      "countryName": "Belgium",
      "isO2Code": "BE",
      "isdCode": 32,
      "dateEntered": "2022-02-26T15:02:54.77"
    },
    {
      "id": 21,
      "countryName": "Belize",
      "isO2Code": "BZ",
      "isdCode": 501,
      "dateEntered": "2022-02-26T15:02:54.7766666"
    },
    {
      "id": 23,
      "countryName": "Benin",
      "isO2Code": "BJ",
      "isdCode": 229,
      "dateEntered": "2022-02-26T15:02:54.7866666"
    },
    {
      "id": 22,
      "countryName": "Bermuda",
      "isO2Code": "BM",
      "isdCode": 1441,
      "dateEntered": "2022-02-26T15:02:54.78"
    },
    {
      "id": 24,
      "countryName": "Bhutan",
      "isO2Code": "BT",
      "isdCode": 975,
      "dateEntered": "2022-02-26T15:02:54.79"
    },
    {
      "id": 26,
      "countryName": "Bolivia",
      "isO2Code": "BO",
      "isdCode": 591,
      "dateEntered": "2022-02-26T15:02:54.8"
    },
    {
      "id": 27,
      "countryName": "Bosnia and Herzegovina",
      "isO2Code": "BA",
      "isdCode": 387,
      "dateEntered": "2022-02-26T15:02:54.8033333"
    },
    {
      "id": 28,
      "countryName": "Botswana",
      "isO2Code": "BW",
      "isdCode": 267,
      "dateEntered": "2022-02-26T15:02:54.8066666"
    },
    {
      "id": 29,
      "countryName": "Brazil",
      "isO2Code": "BR",
      "isdCode": 55,
      "dateEntered": "2022-02-26T15:02:54.8133333"
    },
    {
      "id": 32,
      "countryName": "Brunei",
      "isO2Code": "BN",
      "isdCode": 673,
      "dateEntered": "2022-02-26T15:02:54.83"
    },
    {
      "id": 33,
      "countryName": "Bulgaria",
      "isO2Code": "BG",
      "isdCode": 359,
      "dateEntered": "2022-02-26T15:02:54.8333333"
    },
    {
      "id": 34,
      "countryName": "Burkina Faso",
      "isO2Code": "BF",
      "isdCode": 226,
      "dateEntered": "2022-02-26T15:02:54.8366666"
    },
    {
      "id": 35,
      "countryName": "Burundi",
      "isO2Code": "BI",
      "isdCode": 257,
      "dateEntered": "2022-02-26T15:02:54.8433333"
    },
    {
      "id": 36,
      "countryName": "Cambodia",
      "isO2Code": "KH",
      "isdCode": 855,
      "dateEntered": "2022-02-26T15:02:54.8466666"
    },
    {
      "id": 37,
      "countryName": "Cameroon",
      "isO2Code": "CM",
      "isdCode": 237,
      "dateEntered": "2022-02-26T15:02:54.85"
    },
    {
      "id": 38,
      "countryName": "Canada",
      "isO2Code": "CA",
      "isdCode": 1,
      "dateEntered": "2022-02-26T15:02:54.8566666"
    },
    {
      "id": 39,
      "countryName": "Cape Verde",
      "isO2Code": "CV",
      "isdCode": 238,
      "dateEntered": "2022-02-26T15:02:54.86"
    },
    {
      "id": 40,
      "countryName": "Cayman Islands",
      "isO2Code": "KY",
      "isdCode": 1345,
      "dateEntered": "2022-02-26T15:02:54.8666666"
    },
    {
      "id": 41,
      "countryName": "Central African Republic",
      "isO2Code": "CF",
      "isdCode": 236,
      "dateEntered": "2022-02-26T15:02:54.87"
    },
    {
      "id": 42,
      "countryName": "Chad",
      "isO2Code": "TD",
      "isdCode": 235,
      "dateEntered": "2022-02-26T15:02:54.8766666"
    },
    {
      "id": 43,
      "countryName": "Chile",
      "isO2Code": "CL",
      "isdCode": 56,
      "dateEntered": "2022-02-26T15:02:54.8833333"
    },
    {
      "id": 44,
      "countryName": "China",
      "isO2Code": "CN",
      "isdCode": 86,
      "dateEntered": "2022-02-26T15:02:54.8866666"
    },
    {
      "id": 45,
      "countryName": "Colombia",
      "isO2Code": "CO",
      "isdCode": 57,
      "dateEntered": "2022-02-26T15:02:54.89"
    },
    {
      "id": 46,
      "countryName": "Comoros",
      "isO2Code": "KM",
      "isdCode": 269,
      "dateEntered": "2022-02-26T15:02:54.8966666"
    },
    {
      "id": 48,
      "countryName": "Congo, Democratic",
      "isO2Code": "CD",
      "isdCode": 243,
      "dateEntered": "2022-02-26T15:02:54.9066666"
    },
    {
      "id": 47,
      "countryName": "Congo, Republic of the",
      "isO2Code": "CG",
      "isdCode": 242,
      "dateEntered": "2022-02-26T15:02:54.9"
    },
    {
      "id": 50,
      "countryName": "Costa Rica",
      "isO2Code": "CR",
      "isdCode": 506,
      "dateEntered": "2022-02-26T15:02:54.9166666"
    },
    {
      "id": 51,
      "countryName": "Cote dIvoire",
      "isO2Code": "CI",
      "isdCode": 225,
      "dateEntered": "2022-02-26T15:02:54.92"
    },
    {
      "id": 52,
      "countryName": "Croatia",
      "isO2Code": "HR",
      "isdCode": 385,
      "dateEntered": "2022-02-26T15:02:54.9266666"
    },
    {
      "id": 53,
      "countryName": "Cuba",
      "isO2Code": "CU",
      "isdCode": 53,
      "dateEntered": "2022-02-26T15:02:54.93"
    },
    {
      "id": 54,
      "countryName": "Cyprus",
      "isO2Code": "CY",
      "isdCode": 357,
      "dateEntered": "2022-02-26T15:02:54.9366666"
    },
    {
      "id": 55,
      "countryName": "Czech Republic",
      "isO2Code": "CZ",
      "isdCode": 420,
      "dateEntered": "2022-02-26T15:02:54.9433333"
    },
    {
      "id": 57,
      "countryName": "Denmark",
      "isO2Code": "DK",
      "isdCode": 45,
      "dateEntered": "2022-02-26T15:02:54.95"
    },
    {
      "id": 58,
      "countryName": "Djibouti",
      "isO2Code": "DJ",
      "isdCode": 253,
      "dateEntered": "2022-02-26T15:02:54.9566666"
    },
    {
      "id": 59,
      "countryName": "Dominica",
      "isO2Code": "DM",
      "isdCode": 1767,
      "dateEntered": "2022-02-26T15:02:54.9633333"
    },
    {
      "id": 60,
      "countryName": "Dominican Republic",
      "isO2Code": "DO",
      "isdCode": 1809,
      "dateEntered": "2022-02-26T15:02:54.97"
    },
    {
      "id": 61,
      "countryName": "East Timor (Timor-Leste)",
      "isO2Code": "TL",
      "isdCode": 670,
      "dateEntered": "2022-02-26T15:02:54.9733333"
    },
    {
      "id": 62,
      "countryName": "Ecuador",
      "isO2Code": "EC",
      "isdCode": 593,
      "dateEntered": "2022-02-26T15:02:54.98"
    },
    {
      "id": 63,
      "countryName": "Egypt",
      "isO2Code": "EG",
      "isdCode": 20,
      "dateEntered": "2022-02-26T15:02:54.9833333"
    },
    {
      "id": 64,
      "countryName": "El Salvador",
      "isO2Code": "SV",
      "isdCode": 503,
      "dateEntered": "2022-02-26T15:02:54.9866666"
    },
    {
      "id": 65,
      "countryName": "Equatorial Guinea",
      "isO2Code": "GQ",
      "isdCode": 240,
      "dateEntered": "2022-02-26T15:02:54.9933333"
    },
    {
      "id": 66,
      "countryName": "Eritrea",
      "isO2Code": "ER",
      "isdCode": 291,
      "dateEntered": "2022-02-26T15:02:55"
    },
    {
      "id": 67,
      "countryName": "Estonia",
      "isO2Code": "EE",
      "isdCode": 372,
      "dateEntered": "2022-02-26T15:02:55.0033333"
    },
    {
      "id": 69,
      "countryName": "Ethiopia",
      "isO2Code": "ET",
      "isdCode": 251,
      "dateEntered": "2022-02-26T15:02:55.0166666"
    },
    {
      "id": 70,
      "countryName": "Fiji",
      "isO2Code": "FJ",
      "isdCode": 679,
      "dateEntered": "2022-02-26T15:02:55.02"
    },
    {
      "id": 71,
      "countryName": "Finland",
      "isO2Code": "FI",
      "isdCode": 358,
      "dateEntered": "2022-02-26T15:02:55.0266666"
    },
    {
      "id": 72,
      "countryName": "France",
      "isO2Code": "FR",
      "isdCode": 33,
      "dateEntered": "2022-02-26T15:02:55.03"
    },
    {
      "id": 73,
      "countryName": "Gabon",
      "isO2Code": "GA",
      "isdCode": 241,
      "dateEntered": "2022-02-26T15:02:55.0333333"
    },
    {
      "id": 74,
      "countryName": "Gambia",
      "isO2Code": "GM",
      "isdCode": 220,
      "dateEntered": "2022-02-26T15:02:55.0633333"
    },
    {
      "id": 75,
      "countryName": "Georgia",
      "isO2Code": "GE",
      "isdCode": 995,
      "dateEntered": "2022-02-26T15:02:55.0866666"
    },
    {
      "id": 76,
      "countryName": "Germany",
      "isO2Code": "DE",
      "isdCode": 49,
      "dateEntered": "2022-02-26T15:02:55.09"
    },
    {
      "id": 77,
      "countryName": "Ghana",
      "isO2Code": "GH",
      "isdCode": 233,
      "dateEntered": "2022-02-26T15:02:55.0966666"
    },
    {
      "id": 78,
      "countryName": "Greece",
      "isO2Code": "GR",
      "isdCode": 30,
      "dateEntered": "2022-02-26T15:02:55.11"
    },
    {
      "id": 79,
      "countryName": "Grenada",
      "isO2Code": "GD",
      "isdCode": 1473,
      "dateEntered": "2022-02-26T15:02:55.1366666"
    },
    {
      "id": 80,
      "countryName": "Guam",
      "isO2Code": "GU",
      "isdCode": 1671,
      "dateEntered": "2022-02-26T15:02:55.1433333"
    },
    {
      "id": 81,
      "countryName": "Guatemala",
      "isO2Code": "GT",
      "isdCode": 502,
      "dateEntered": "2022-02-26T15:02:55.1466666"
    },
    {
      "id": 82,
      "countryName": "Guinea",
      "isO2Code": "GN",
      "isdCode": 224,
      "dateEntered": "2022-02-26T15:02:55.1533333"
    },
    {
      "id": 83,
      "countryName": "Guinea-Bissau",
      "isO2Code": "GW",
      "isdCode": 245,
      "dateEntered": "2022-02-26T15:02:55.1566666"
    },
    {
      "id": 84,
      "countryName": "Guyana",
      "isO2Code": "GY",
      "isdCode": 592,
      "dateEntered": "2022-02-26T15:02:55.16"
    },
    {
      "id": 85,
      "countryName": "Haiti",
      "isO2Code": "HT",
      "isdCode": 509,
      "dateEntered": "2022-02-26T15:02:55.1666666"
    },
    {
      "id": 86,
      "countryName": "Honduras",
      "isO2Code": "HN",
      "isdCode": 504,
      "dateEntered": "2022-02-26T15:02:55.17"
    },
    {
      "id": 87,
      "countryName": "Hong Kong",
      "isO2Code": "HK",
      "isdCode": 852,
      "dateEntered": "2022-02-26T15:02:55.1766666"
    },
    {
      "id": 88,
      "countryName": "Hungary",
      "isO2Code": "HU",
      "isdCode": 36,
      "dateEntered": "2022-02-26T15:02:55.18"
    },
    {
      "id": 89,
      "countryName": "Iceland",
      "isO2Code": "IS",
      "isdCode": 354,
      "dateEntered": "2022-02-26T15:02:55.1866666"
    },
    {
      "id": 90,
      "countryName": "India",
      "isO2Code": "IN",
      "isdCode": 91,
      "dateEntered": "2022-02-26T15:02:55.19"
    },
    {
      "id": 91,
      "countryName": "Indonesia",
      "isO2Code": "ID",
      "isdCode": 62,
      "dateEntered": "2022-02-26T15:02:55.1966666"
    },
    {
      "id": 92,
      "countryName": "Iran",
      "isO2Code": "IR",
      "isdCode": 98,
      "dateEntered": "2022-02-26T15:02:55.2"
    },
    {
      "id": 93,
      "countryName": "Iraq",
      "isO2Code": "IQ",
      "isdCode": 964,
      "dateEntered": "2022-02-26T15:02:55.2066666"
    },
    {
      "id": 94,
      "countryName": "Ireland",
      "isO2Code": "IE",
      "isdCode": 353,
      "dateEntered": "2022-02-26T15:02:55.21"
    },
    {
      "id": 95,
      "countryName": "Israel",
      "isO2Code": "IL",
      "isdCode": 972,
      "dateEntered": "2022-02-26T15:02:55.2166666"
    },
    {
      "id": 96,
      "countryName": "Italy",
      "isO2Code": "IT",
      "isdCode": 39,
      "dateEntered": "2022-02-26T15:02:55.22"
    },
    {
      "id": 97,
      "countryName": "Jamaica",
      "isO2Code": "JM",
      "isdCode": 1876,
      "dateEntered": "2022-02-26T15:02:55.2233333"
    },
    {
      "id": 98,
      "countryName": "Japan",
      "isO2Code": "JP",
      "isdCode": 81,
      "dateEntered": "2022-02-26T15:02:55.23"
    },
    {
      "id": 99,
      "countryName": "Jordan",
      "isO2Code": "JO",
      "isdCode": 962,
      "dateEntered": "2022-02-26T15:02:55.2366666"
    },
    {
      "id": 100,
      "countryName": "Kazakhstan",
      "isO2Code": "KZ",
      "isdCode": 7,
      "dateEntered": "2022-02-26T15:02:55.2433333"
    },
    {
      "id": 101,
      "countryName": "Kenya",
      "isO2Code": "KE",
      "isdCode": 254,
      "dateEntered": "2022-02-26T15:02:55.25"
    },
    {
      "id": 102,
      "countryName": "Kiribati",
      "isO2Code": "KI",
      "isdCode": 686,
      "dateEntered": "2022-02-26T15:02:55.2533333"
    },
    {
      "id": 103,
      "countryName": "Korea, North\u00A0(PDR of Korea)",
      "isO2Code": "KP",
      "isdCode": 850,
      "dateEntered": "2022-02-26T15:02:55.26"
    },
    {
      "id": 104,
      "countryName": "Korea, South",
      "isO2Code": "KR",
      "isdCode": 82,
      "dateEntered": "2022-02-26T15:02:55.2633333"
    },
    {
      "id": 106,
      "countryName": "Kuwait",
      "isO2Code": "KW",
      "isdCode": 965,
      "dateEntered": "2022-02-26T15:02:55.2733333"
    },
    {
      "id": 107,
      "countryName": "Kyrgyzstan",
      "isO2Code": "KG",
      "isdCode": 996,
      "dateEntered": "2022-02-26T15:02:55.28"
    },
    {
      "id": 109,
      "countryName": "Latvia",
      "isO2Code": "LV",
      "isdCode": 371,
      "dateEntered": "2022-02-26T15:02:55.29"
    },
    {
      "id": 110,
      "countryName": "Lebanon",
      "isO2Code": "LB",
      "isdCode": 961,
      "dateEntered": "2022-02-26T15:02:55.2966666"
    },
    {
      "id": 111,
      "countryName": "Lesotho",
      "isO2Code": "LS",
      "isdCode": 266,
      "dateEntered": "2022-02-26T15:02:55.3033333"
    },
    {
      "id": 112,
      "countryName": "Liberia",
      "isO2Code": "LR",
      "isdCode": 231,
      "dateEntered": "2022-02-26T15:02:55.3066666"
    },
    {
      "id": 113,
      "countryName": "Libya",
      "isO2Code": "LY",
      "isdCode": 218,
      "dateEntered": "2022-02-26T15:02:55.31"
    },
    {
      "id": 114,
      "countryName": "Liechtenstein",
      "isO2Code": "LI",
      "isdCode": 423,
      "dateEntered": "2022-02-26T15:02:55.3166666"
    },
    {
      "id": 115,
      "countryName": "Lithuania",
      "isO2Code": "LT",
      "isdCode": 370,
      "dateEntered": "2022-02-26T15:02:55.32"
    },
    {
      "id": 116,
      "countryName": "Luxembourg",
      "isO2Code": "LU",
      "isdCode": 352,
      "dateEntered": "2022-02-26T15:02:55.3266666"
    },
    {
      "id": 117,
      "countryName": "Madagascar",
      "isO2Code": "MG",
      "isdCode": 261,
      "dateEntered": "2022-02-26T15:02:55.33"
    },
    {
      "id": 118,
      "countryName": "Malawi",
      "isO2Code": "MW",
      "isdCode": 265,
      "dateEntered": "2022-02-26T15:02:55.3366666"
    },
    {
      "id": 120,
      "countryName": "Malaysia",
      "isO2Code": "MY",
      "isdCode": 60,
      "dateEntered": "2022-02-26T15:02:55.3466666"
    },
    {
      "id": 121,
      "countryName": "Maldives",
      "isO2Code": "MV",
      "isdCode": 960,
      "dateEntered": "2022-02-26T15:02:55.35"
    },
    {
      "id": 122,
      "countryName": "Mali",
      "isO2Code": "ML",
      "isdCode": 223,
      "dateEntered": "2022-02-26T15:02:55.3566666"
    },
    {
      "id": 123,
      "countryName": "Malta",
      "isO2Code": "MT",
      "isdCode": 356,
      "dateEntered": "2022-02-26T15:02:55.3833333"
    },
    {
      "id": 124,
      "countryName": "Marshall Islands",
      "isO2Code": "MH",
      "isdCode": 692,
      "dateEntered": "2022-02-26T15:02:55.39"
    },
    {
      "id": 125,
      "countryName": "Mauritania",
      "isO2Code": "MR",
      "isdCode": 222,
      "dateEntered": "2022-02-26T15:02:55.3933333"
    },
    {
      "id": 126,
      "countryName": "Mauritius",
      "isO2Code": "MU",
      "isdCode": 230,
      "dateEntered": "2022-02-26T15:02:55.4"
    },
    {
      "id": 127,
      "countryName": "Mexico",
      "isO2Code": "MX",
      "isdCode": 52,
      "dateEntered": "2022-02-26T15:02:55.4033333"
    },
    {
      "id": 128,
      "countryName": "Micronesia (Federated States of)",
      "isO2Code": "FM",
      "isdCode": 691,
      "dateEntered": "2022-02-26T15:02:55.41"
    },
    {
      "id": 129,
      "countryName": "Moldova",
      "isO2Code": "MD",
      "isdCode": 373,
      "dateEntered": "2022-02-26T15:02:55.4133333"
    },
    {
      "id": 130,
      "countryName": "Monaco",
      "isO2Code": "MC",
      "isdCode": 377,
      "dateEntered": "2022-02-26T15:02:55.4166666"
    },
    {
      "id": 131,
      "countryName": "Mongolia",
      "isO2Code": "MN",
      "isdCode": 976,
      "dateEntered": "2022-02-26T15:02:55.4233333"
    },
    {
      "id": 132,
      "countryName": "Montenegro",
      "isO2Code": "ME",
      "isdCode": 382,
      "dateEntered": "2022-02-26T15:02:55.4366666"
    },
    {
      "id": 133,
      "countryName": "Morocco",
      "isO2Code": "MA",
      "isdCode": 212,
      "dateEntered": "2022-02-26T15:02:55.4433333"
    },
    {
      "id": 134,
      "countryName": "Mozambique",
      "isO2Code": "MZ",
      "isdCode": 258,
      "dateEntered": "2022-02-26T15:02:55.4466666"
    },
    {
      "id": 135,
      "countryName": "Myanmar (Burma)",
      "isO2Code": "MM",
      "isdCode": 95,
      "dateEntered": "2022-02-26T15:02:55.4533333"
    },
    {
      "id": 136,
      "countryName": "Namibia",
      "isO2Code": "NA",
      "isdCode": 264,
      "dateEntered": "2022-02-26T15:02:55.4566666"
    },
    {
      "id": 137,
      "countryName": "Nauru",
      "isO2Code": "NR",
      "isdCode": 674,
      "dateEntered": "2022-02-26T15:02:55.4633333"
    },
    {
      "id": 138,
      "countryName": "Nepal",
      "isO2Code": "NP",
      "isdCode": 977,
      "dateEntered": "2022-02-26T15:02:55.4666666"
    },
    {
      "id": 139,
      "countryName": "Netherlands",
      "isO2Code": "NL",
      "isdCode": 31,
      "dateEntered": "2022-02-26T15:02:55.4733333"
    },
    {
      "id": 140,
      "countryName": "Netherlands Antilles",
      "isO2Code": "AN",
      "isdCode": 599,
      "dateEntered": "2022-02-26T15:02:55.4766666"
    },
    {
      "id": 141,
      "countryName": "New Zealand",
      "isO2Code": "NZ",
      "isdCode": 64,
      "dateEntered": "2022-02-26T15:02:55.48"
    },
    {
      "id": 142,
      "countryName": "Nicaragua",
      "isO2Code": "NI",
      "isdCode": 505,
      "dateEntered": "2022-02-26T15:02:55.4866666"
    },
    {
      "id": 143,
      "countryName": "Niger",
      "isO2Code": "NE",
      "isdCode": 227,
      "dateEntered": "2022-02-26T15:02:55.49"
    },
    {
      "id": 144,
      "countryName": "Nigeria",
      "isO2Code": "NG",
      "isdCode": 234,
      "dateEntered": "2022-02-26T15:02:55.4966666"
    },
    {
      "id": 148,
      "countryName": "Norway",
      "isO2Code": "NO",
      "isdCode": 47,
      "dateEntered": "2022-02-26T15:02:55.5133333"
    },
    {
      "id": 149,
      "countryName": "Oman",
      "isO2Code": "OM",
      "isdCode": 968,
      "dateEntered": "2022-02-26T15:02:55.52"
    },
    {
      "id": 150,
      "countryName": "Pakistan",
      "isO2Code": "PK",
      "isdCode": 92,
      "dateEntered": "2022-02-26T15:02:55.5233333"
    },
    {
      "id": 151,
      "countryName": "Palau",
      "isO2Code": "PW",
      "isdCode": 680,
      "dateEntered": "2022-02-26T15:02:55.53"
    },
    {
      "id": 152,
      "countryName": "Palestine",
      "isO2Code": "PS",
      "isdCode": 970,
      "dateEntered": "2022-02-26T15:02:55.5333333"
    },
    {
      "id": 153,
      "countryName": "Panama",
      "isO2Code": "PA",
      "isdCode": 507,
      "dateEntered": "2022-02-26T15:02:55.54"
    },
    {
      "id": 154,
      "countryName": "Papua New Guinea",
      "isO2Code": "PG",
      "isdCode": 675,
      "dateEntered": "2022-02-26T15:02:55.5433333"
    },
    {
      "id": 155,
      "countryName": "Paraguay",
      "isO2Code": "PY",
      "isdCode": 595,
      "dateEntered": "2022-02-26T15:02:55.5566666"
    },
    {
      "id": 156,
      "countryName": "Peru",
      "isO2Code": "PE",
      "isdCode": 51,
      "dateEntered": "2022-02-26T15:02:55.56"
    },
    {
      "id": 157,
      "countryName": "Philippines",
      "isO2Code": "PH",
      "isdCode": 63,
      "dateEntered": "2022-02-26T15:02:55.5666666"
    },
    {
      "id": 158,
      "countryName": "Poland",
      "isO2Code": "PL",
      "isdCode": 48,
      "dateEntered": "2022-02-26T15:02:55.57"
    },
    {
      "id": 159,
      "countryName": "Portugal",
      "isO2Code": "PT",
      "isdCode": 351,
      "dateEntered": "2022-02-26T15:02:55.5766666"
    },
    {
      "id": 160,
      "countryName": "Puerto Rico",
      "isO2Code": "PR",
      "isdCode": 1787,
      "dateEntered": "2022-02-26T15:02:55.58"
    },
    {
      "id": 161,
      "countryName": "Qatar",
      "isO2Code": "QA",
      "isdCode": 968,
      "dateEntered": "2022-02-26T15:02:55.5866666"
    },
    {
      "id": 49,
      "countryName": "Republic of the Cook Islands",
      "isO2Code": "CK",
      "isdCode": 682,
      "dateEntered": "2022-02-26T15:02:54.91"
    },
    {
      "id": 163,
      "countryName": "Romania",
      "isO2Code": "RO",
      "isdCode": 40,
      "dateEntered": "2022-02-26T15:02:55.5933333"
    },
    {
      "id": 164,
      "countryName": "Russia",
      "isO2Code": "RU",
      "isdCode": 7,
      "dateEntered": "2022-02-26T15:02:55.5966666"
    },
    {
      "id": 165,
      "countryName": "Rwanda",
      "isO2Code": "RW",
      "isdCode": 250,
      "dateEntered": "2022-02-26T15:02:55.6033333"
    },
    {
      "id": 167,
      "countryName": "Saint Kitts and Nevis",
      "isO2Code": "KN",
      "isdCode": 1869,
      "dateEntered": "2022-02-26T15:02:55.6133333"
    },
    {
      "id": 168,
      "countryName": "Saint Lucia",
      "isO2Code": "LC",
      "isdCode": 1758,
      "dateEntered": "2022-02-26T15:02:55.6166666"
    },
    {
      "id": 169,
      "countryName": "Saint Vincent and the Grenadines",
      "isO2Code": "VC",
      "isdCode": 1784,
      "dateEntered": "2022-02-26T15:02:55.6233333"
    },
    {
      "id": 170,
      "countryName": "Samoa",
      "isO2Code": "WS",
      "isdCode": 685,
      "dateEntered": "2022-02-26T15:02:55.6266666"
    },
    {
      "id": 171,
      "countryName": "San Marino",
      "isO2Code": "SM",
      "isdCode": 378,
      "dateEntered": "2022-02-26T15:02:55.63"
    },
    {
      "id": 172,
      "countryName": "Sao Tome and Principe",
      "isO2Code": "ST",
      "isdCode": 239,
      "dateEntered": "2022-02-26T15:02:55.6366666"
    },
    {
      "id": 173,
      "countryName": "Saudi Arabia",
      "isO2Code": "SA",
      "isdCode": 966,
      "dateEntered": "2022-02-26T15:02:55.64"
    },
    {
      "id": 174,
      "countryName": "Senegal",
      "isO2Code": "SN",
      "isdCode": 221,
      "dateEntered": "2022-02-26T15:02:55.6466666"
    },
    {
      "id": 175,
      "countryName": "Serbia",
      "isO2Code": "RS",
      "isdCode": 381,
      "dateEntered": "2022-02-26T15:02:55.65"
    },
    {
      "id": 177,
      "countryName": "Seychelles",
      "isO2Code": "SC",
      "isdCode": 248,
      "dateEntered": "2022-02-26T15:02:55.66"
    },
    {
      "id": 178,
      "countryName": "Sierra Leone",
      "isO2Code": "SL",
      "isdCode": 232,
      "dateEntered": "2022-02-26T15:02:55.6633333"
    },
    {
      "id": 179,
      "countryName": "Singapore",
      "isO2Code": "SG",
      "isdCode": 65,
      "dateEntered": "2022-02-26T15:02:55.67"
    },
    {
      "id": 180,
      "countryName": "Slovakia",
      "isO2Code": "SK",
      "isdCode": 421,
      "dateEntered": "2022-02-26T15:02:55.6733333"
    },
    {
      "id": 181,
      "countryName": "Slovenia",
      "isO2Code": "SI",
      "isdCode": 386,
      "dateEntered": "2022-02-26T15:02:55.68"
    },
    {
      "id": 182,
      "countryName": "Solomon Islands",
      "isO2Code": "SB",
      "isdCode": 677,
      "dateEntered": "2022-02-26T15:02:55.6833333"
    },
    {
      "id": 183,
      "countryName": "Somalia",
      "isO2Code": "SO",
      "isdCode": 252,
      "dateEntered": "2022-02-26T15:02:55.6866666"
    },
    {
      "id": 184,
      "countryName": "South Africa",
      "isO2Code": "ZA",
      "isdCode": 27,
      "dateEntered": "2022-02-26T15:02:55.6933333"
    },
    {
      "id": 185,
      "countryName": "South Sudan",
      "isO2Code": "SS",
      "isdCode": 211,
      "dateEntered": "2022-02-26T15:02:55.6966666"
    },
    {
      "id": 188,
      "countryName": "Spain",
      "isO2Code": "ES",
      "isdCode": 34,
      "dateEntered": "2022-02-26T15:02:55.7133333"
    },
    {
      "id": 189,
      "countryName": "Sri Lanka",
      "isO2Code": "LK",
      "isdCode": 94,
      "dateEntered": "2022-02-26T15:02:55.72"
    },
    {
      "id": 190,
      "countryName": "Sudan",
      "isO2Code": "SD",
      "isdCode": 249,
      "dateEntered": "2022-02-26T15:02:55.7233333"
    },
    {
      "id": 191,
      "countryName": "Suriname",
      "isO2Code": "SR",
      "isdCode": 597,
      "dateEntered": "2022-02-26T15:02:55.73"
    },
    {
      "id": 192,
      "countryName": "Sweden",
      "isO2Code": "SE",
      "isdCode": 46,
      "dateEntered": "2022-02-26T15:02:55.7333333"
    },
    {
      "id": 193,
      "countryName": "Switzerland",
      "isO2Code": "CH",
      "isdCode": 41,
      "dateEntered": "2022-02-26T15:02:55.74"
    },
    {
      "id": 194,
      "countryName": "Syria",
      "isO2Code": "SY",
      "isdCode": 963,
      "dateEntered": "2022-02-26T15:02:55.7433333"
    },
    {
      "id": 195,
      "countryName": "Taiwan",
      "isO2Code": "TW",
      "isdCode": 886,
      "dateEntered": "2022-02-26T15:02:55.75"
    },
    {
      "id": 196,
      "countryName": "Tajikistan",
      "isO2Code": "TJ",
      "isdCode": 992,
      "dateEntered": "2022-02-26T15:02:55.7533333"
    },
    {
      "id": 197,
      "countryName": "Tanzania",
      "isO2Code": "TZ",
      "isdCode": 255,
      "dateEntered": "2022-02-26T15:02:55.7566666"
    },
    {
      "id": 198,
      "countryName": "Thailand",
      "isO2Code": "TH",
      "isdCode": 66,
      "dateEntered": "2022-02-26T15:02:55.7633333"
    },
    {
      "id": 15,
      "countryName": "The Bahamas",
      "isO2Code": "BS",
      "isdCode": 1242,
      "dateEntered": "2022-02-26T15:02:54.7333333"
    },
    {
      "id": 199,
      "countryName": "Togo",
      "isO2Code": "TG",
      "isdCode": 228,
      "dateEntered": "2022-02-26T15:02:55.77"
    },
    {
      "id": 200,
      "countryName": "Tonga",
      "isO2Code": "TO",
      "isdCode": 676,
      "dateEntered": "2022-02-26T15:02:55.7733333"
    },
    {
      "id": 201,
      "countryName": "Trinidad and Tobago",
      "isO2Code": "TT",
      "isdCode": 1868,
      "dateEntered": "2022-02-26T15:02:55.78"
    },
    {
      "id": 202,
      "countryName": "Tunisia",
      "isO2Code": "TN",
      "isdCode": 216,
      "dateEntered": "2022-02-26T15:02:55.7833333"
    },
    {
      "id": 203,
      "countryName": "Turkey",
      "isO2Code": "TR",
      "isdCode": 90,
      "dateEntered": "2022-02-26T15:02:55.79"
    },
    {
      "id": 204,
      "countryName": "Turkmenistan",
      "isO2Code": "TM",
      "isdCode": 993,
      "dateEntered": "2022-02-26T15:02:55.7933333"
    },
    {
      "id": 205,
      "countryName": "Tuvalu",
      "isO2Code": "TV",
      "isdCode": 688,
      "dateEntered": "2022-02-26T15:02:55.8"
    },
    {
      "id": 206,
      "countryName": "Uganda",
      "isO2Code": "UG",
      "isdCode": 256,
      "dateEntered": "2022-02-26T15:02:55.8033333"
    },
    {
      "id": 207,
      "countryName": "Ukraine",
      "isO2Code": "UA",
      "isdCode": 380,
      "dateEntered": "2022-02-26T15:02:55.81"
    },
    {
      "id": 208,
      "countryName": "United Arab Emirates",
      "isO2Code": "AE",
      "isdCode": 971,
      "dateEntered": "2022-02-26T15:02:55.8133333"
    },
    {
      "id": 210,
      "countryName": "United Kingdom (Great Britain)",
      "isO2Code": "GB",
      "isdCode": 44,
      "dateEntered": "2022-02-26T15:02:55.8233333"
    },
    {
      "id": 211,
      "countryName": "United States",
      "isO2Code": "US",
      "isdCode": 1,
      "dateEntered": "2022-02-26T15:02:55.83"
    },
    {
      "id": 212,
      "countryName": "Uruguay",
      "isO2Code": "UY",
      "isdCode": 598,
      "dateEntered": "2022-02-26T15:02:55.8333333"
    },
    {
      "id": 213,
      "countryName": "Uzbekistan",
      "isO2Code": "UZ",
      "isdCode": 998,
      "dateEntered": "2022-02-26T15:02:55.8366666"
    },
    {
      "id": 214,
      "countryName": "Vanuatu",
      "isO2Code": "VU",
      "isdCode": 678,
      "dateEntered": "2022-02-26T15:02:55.84"
    },
    {
      "id": 215,
      "countryName": "Venezuela",
      "isO2Code": "VE",
      "isdCode": 58,
      "dateEntered": "2022-02-26T15:02:55.8466666"
    },
    {
      "id": 216,
      "countryName": "Vietnam",
      "isO2Code": "VN",
      "isdCode": 84,
      "dateEntered": "2022-02-26T15:02:55.85"
    },
    {
      "id": 217,
      "countryName": "Virgin Islands",
      "isO2Code": "VG",
      "isdCode": 1340,
      "dateEntered": "2022-02-26T15:02:55.8566666"
    },
    {
      "id": 220,
      "countryName": "Yemen",
      "isO2Code": "YE",
      "isdCode": 967,
      "dateEntered": "2022-02-26T15:02:55.87"
    },
    {
      "id": 222,
      "countryName": "Zambia",
      "isO2Code": "ZM",
      "isdCode": 260,
      "dateEntered": "2022-02-26T15:02:55.88"
    },
    {
      "id": 223,
      "countryName": "Zimbabwe",
      "isO2Code": "ZW",
      "isdCode": 263,
      "dateEntered": "2022-02-26T15:02:55.8833333"
    }
  ]

const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

export function OrganizationInfo() {
  const router = useRouter()
  const { tenantInfo: contextTenantInfo, refreshTenantInfo } = useTenant()
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfoState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [editBasicForm, setEditBasicForm] = useState(false)
  const [editLocationForm, setEditLocationForm] = useState(false)
  const [editContactForm, setEditContactForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false)
  const [isDiaryOpen, setIsDiaryOpen] = useState(false)
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([])
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [isStateOpen, setIsStateOpen] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("")

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const result = await getJson<GetCountriesResponse>("/api/country/get-country")
        const options =
          result.data?.countries?.map((country) => ({
            value: country.iso2Code || country.id,
            label: country.name,
          })) ?? []
        if (options.length == 0) {
          setCountries(defaultCountries.map((country) => ({ value: country.isO2Code || country.id.toString(), label: country.countryName })))
        } else {
          setCountries(options)
        }
      } catch (error) {
        console.error("Failed to load countries", error)
      }
    }

    loadCountries()
  }, [])

  useEffect(() => {
    const loadTenantInfo = async () => {
      setIsLoading(true)
      try {
        const info = await getTenantInfo()
        if (info) {
          setOrganizationInfo(info)
          setSelectedCountryCode(info.countryISO2Code || "")
        } else if (contextTenantInfo) {
          setOrganizationInfo(contextTenantInfo)
          setSelectedCountryCode(contextTenantInfo.countryISO2Code || "")
        }
      } catch (error) {
        console.error("Failed to load tenant info", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTenantInfo()
  }, [contextTenantInfo])

  const handleSave = async (section: "basic" | "location" | "contact") => {
    setIsSaving(true)
    try {
      // Get tenant ID from API
      const tenantData = await getTenantInfoWithId()
      if (!tenantData || !tenantData.id) {
        throw new Error("Tenant ID not found")
      }

      await updateTenantInfo(tenantData.id, organizationInfo)
      await refreshTenantInfo()

      if (section === "basic") setEditBasicForm(false)
      if (section === "location") setEditLocationForm(false)
      if (section === "contact") setEditContactForm(false)
    } catch (error) {
      console.error("Failed to save tenant info", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (section: "basic" | "location" | "contact") => {
    // Reload original data
    const loadOriginal = async () => {
      const info = await getTenantInfo()
      if (info) {
        setOrganizationInfo(info)
      }
    }
    loadOriginal()

    if (section === "basic") setEditBasicForm(false)
    if (section === "location") setEditLocationForm(false)
    if (section === "contact") setEditContactForm(false)
  }

  const SectionHeader = ({
    icon: Icon,
    title,
    onEdit,
    isEditing,
    onSave,
    onCancel,
    showExpand = false,
    isExpanded = false,
    onExpand,
    onExternalLink
  }: {
    icon: any
    title: string
    onEdit?: () => void
    isEditing?: boolean
    onSave?: () => void
    onCancel?: () => void
    showExpand?: boolean
    isExpanded?: boolean
    onExpand?: () => void
    onExternalLink?: () => void
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="text-lg font-bold text-emerald-600">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {showExpand && (
          <>
            {onExternalLink && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExternalLink}
                className="text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="text-primary"
            >
              {isExpanded ? (
                <>
                  hide <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  expand <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </>
        )}
        {!showExpand && (
          <>
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="text-primary"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Basic Details, Location, and Contacts in one horizontal line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Details Section */}
        <div className="flex flex-col gap-3 lg:pr-6 lg:border-r lg:border-border">
          <div className="flex-col">
            <SectionHeader
              icon={FileText}
              title="Basic Details"
              onEdit={() => setEditBasicForm(true)}
              isEditing={editBasicForm}
              onSave={() => handleSave("basic")}
              onCancel={() => handleCancel("basic")}
            />
            {editBasicForm ? (
              <div className="space-y-2 pt-2">
                <FloatingInput
                  label="Organization Name"
                  value={organizationInfo.name || ""}
                  onChange={(e) => setOrganizationInfo({ ...organizationInfo, name: e.target.value })}
                  required
                />
                <FloatingInput
                  label="Rescue Acronym"
                  value={organizationInfo.tenantAcronym || ""}
                  onChange={(e) => setOrganizationInfo({ ...organizationInfo, tenantAcronym: e.target.value })}
                  required
                />
              </div>
            ) : (
              <div className="flex gap-5 p-3">
                <div className="flex flex-col gap-4">
                  <span className="font-medium">Organization Name : </span>
                  <span className="font-medium">Rescue Acronym : </span>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="block">{organizationInfo.name || "—"}</span>
                  <span className="block">{organizationInfo.tenantAcronym || "—"}</span>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-1" />

          <div className="flex flex-col">
            <div>
              <SectionHeader
                icon={Mail}
                title="Contacts"
                onEdit={() => setEditContactForm(true)}
                isEditing={editContactForm}
                onSave={() => handleSave("contact")}
                onCancel={() => handleCancel("contact")}
              />
              {editContactForm ? (
                <div className="space-y-2 pt-2">
                  <FloatingInput
                    label="Phone Number"
                    value={organizationInfo.phone || ""}
                    onChange={(e) => setOrganizationInfo({ ...organizationInfo, phone: e.target.value })}
                  />
                  <FloatingInput
                    label="Email"
                    type="email"
                    value={organizationInfo.emailAddress || ""}
                    onChange={(e) => setOrganizationInfo({ ...organizationInfo, emailAddress: e.target.value })}
                    required
                  />
                  <FloatingInput
                    label="URL"
                    value={organizationInfo.website || ""}
                    onChange={(e) => setOrganizationInfo({ ...organizationInfo, website: e.target.value })}
                    required
                  />
                </div>
              ) : (
                <div className="flex gap-5 p-3">
                  <div className="flex flex-col gap-4">
                    <span className="font-medium">Phone Number : </span>
                    <span className="font-medium">Email : </span>
                    <span className="font-medium">URL : </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="block">{organizationInfo.phone || "—"}</span>
                    <span className="block">{organizationInfo.emailAddress || "—"}</span>
                    <span className="block">{organizationInfo.website || "—"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="flex flex-col">
          <SectionHeader
            icon={MapPin}
            title="Location"
            onEdit={() => setEditLocationForm(true)}
            isEditing={editLocationForm}
            onSave={() => handleSave("location")}
            onCancel={() => handleCancel("location")}
          />
          {editLocationForm ? (
            <div className="flex flex-col gap-2 space-y-2 pt-2">
              <FloatingInput
                label="Street"
                value={organizationInfo.street || ""}
                onChange={(e) => setOrganizationInfo({ ...organizationInfo, street: e.target.value })}
                required
              />
              <FloatingInput
                label="City"
                value={organizationInfo.city || ""}
                onChange={(e) => setOrganizationInfo({ ...organizationInfo, city: e.target.value })}
                required
              />
              <div className="relative">
                <Popover open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 pt-4 pb-1 text-sm text-left ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        "border-input",
                        !selectedCountryCode && "text-transparent",
                      )}
                    >
                      <span className={cn(
                        selectedCountryCode ? "opacity-100" : "opacity-0"
                      )}>
                        {selectedCountryCode
                          ? countries.find((c) => c.value === selectedCountryCode)?.label ?? organizationInfo.countryName ?? ""
                          : ""}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.label}
                              onSelect={() => {
                                setSelectedCountryCode(country.value)
                                const selectedCountry = countries.find((c) => c.value === country.value)
                                setOrganizationInfo({
                                  ...organizationInfo,
                                  countryName: selectedCountry?.label || "",
                                  countryISO2Code: country.value
                                })
                                setIsCountryOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCountryCode === country.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {country.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <label
                  className={cn(
                    "absolute left-3 transition-all duration-200 pointer-events-none",
                    selectedCountryCode || isCountryOpen ? "top-1 text-xs" : "top-2.5 text-sm",
                    "text-muted-foreground",
                  )}
                >
                  Country <span className="text-red-500 ml-0.5">*</span>
                </label>
              </div>
              {selectedCountryCode === "US" ? (
                <div className="relative">
                  <Popover open={isStateOpen} onOpenChange={setIsStateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 pt-4 pb-1 text-sm text-left ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                          "border-input",
                          !organizationInfo.state && "text-transparent",
                        )}
                      >
                        <span className={cn(
                          organizationInfo.state ? "opacity-100" : "opacity-0"
                        )}>
                          {organizationInfo.state
                            ? usStates.find((s) => s.value === organizationInfo.state)?.label ?? organizationInfo.state
                            : ""}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandList>
                          <CommandEmpty>No state found.</CommandEmpty>
                          <CommandGroup>
                            {usStates.map((state) => (
                              <CommandItem
                                key={state.value}
                                value={state.label}
                                onSelect={() => {
                                  setOrganizationInfo({ ...organizationInfo, state: state.value })
                                  setIsStateOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    organizationInfo.state === state.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {state.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <label
                    className={cn(
                      "absolute left-3 transition-all duration-200 pointer-events-none",
                      organizationInfo.state || isStateOpen ? "top-1 text-xs" : "top-2.5 text-sm",
                      "text-muted-foreground",
                    )}
                  >
                    State/Province/Locality <span className="text-red-500 ml-0.5">*</span>
                  </label>
                </div>
              ) : (
                <FloatingInput
                  label="State/Province/Locality"
                  value={organizationInfo.state || ""}
                  onChange={(e) => setOrganizationInfo({ ...organizationInfo, state: e.target.value })}
                  required
                />
              )}
              <FloatingInput
                label="Zip/Postal Code"
                value={organizationInfo.zip || ""}
                onChange={(e) => setOrganizationInfo({ ...organizationInfo, zip: e.target.value })}
              />
            </div>
          ) : (
            <div className="flex gap-5 p-3">
              <div className="flex flex-col gap-5">
                <span className="font-medium">Street : </span>
                <span className="font-medium">City : </span>
                <span className="font-medium">State/Province/Locality : </span>
                <span className="font-medium">Zip/Postal Code : </span>
                <span className="font-medium">Country : </span>
              </div>
              <div className="flex flex-col gap-5">
                <span className="block">{organizationInfo.street || "—"}</span>
                <span className="block">{organizationInfo.city || "—"}</span>
                <span className="block">{organizationInfo.state || "—"}</span>
                <span className="block">{organizationInfo.zip || "—"}</span>
                <span className="block">{organizationInfo.countryName || "—"}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      <Separator />

      {/* Manage Photos, Videos, and Documents Section */}
      <Collapsible open={isAttachmentsOpen} onOpenChange={setIsAttachmentsOpen}>
        <div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-emerald-600">Manage Photos, Videos, and Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/customization/tenant-attachments")}
                className="text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAttachmentsOpen(!isAttachmentsOpen)}
                className="text-primary"
              >
                {isAttachmentsOpen ? (
                  <>
                    hide <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    expand <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <CollapsibleContent className="pt-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">
                Manage your organization's photos, videos, and documents. Click the external link icon to open the full management page.
              </p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      <Separator />

      {/* Diary Section */}
      <Collapsible open={isDiaryOpen} onOpenChange={setIsDiaryOpen}>
        <div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Book className="h-5 w-5" />
              <span className="text-lg font-bold text-emerald-600">Diary</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/customization/diary")}
                className="text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDiaryOpen(!isDiaryOpen)}
                className="text-primary"
              >
                {isDiaryOpen ? (
                  <>
                    hide <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    expand <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <CollapsibleContent className="pt-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">
                View and manage your organization's diary entries. Click the external link icon to open the full diary page.
              </p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  )
}
