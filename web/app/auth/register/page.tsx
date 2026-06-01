"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Mail, CheckCircle2, XCircle, ChevronsUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { postJson, getJson, getJsonNoAuth, fetchRegions } from "@/lib/api"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [lastVerificationEmail, setLastVerificationEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [isStateOpen, setIsStateOpen] = useState(false)
  const [selectedCountryISO2Code, setSelectedCountryISO2Code] = useState("")
  const [formData, setFormData] = useState({
    // Step 1: Organization Info
    organizationName: "",
    acronym: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    countryId: 0,
    countryName: "",
    website: "",
    // Step 2: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const normalizedCurrentEmail = formData.email.trim().toLowerCase()
  const hasEmailChangedSinceLastCode =
    !!lastVerificationEmail && normalizedCurrentEmail !== lastVerificationEmail

  type ApiCountry = {
    id: string | number
    name?: string | null
    countryName?: string | null
    iso2Code?: string | null
    isO2Code?: string | null
    isdCode?: number | null
  }

  type GetCountriesResponse = {
    data: {
      countries: ApiCountry[]
    }
  }
  const defaultCountries = 
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
  type CountryOption = { id: number; label: string; iso2Code: string }
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [isCountriesLoading, setIsCountriesLoading] = useState(false)
  const [regions, setRegions] = useState<Array<{ value: string; label: string }>>([])
  const [isRegionsLoading, setIsRegionsLoading] = useState(false)
  const [isOnboardingDemoEnabled, setIsOnboardingDemoEnabled] = useState(false)
  const [isOnboardingDemoLoading, setIsOnboardingDemoLoading] = useState(true)

  const mergeCountryOptions = (apiOptions: CountryOption[]): CountryOption[] => {
    const mergedByKey = new Map<string, CountryOption>()

    for (const country of apiOptions) {
      const label = country.label?.toString().trim()
      if (!label) continue
      const iso2Code = (country.iso2Code || "").toString().toUpperCase().trim()
      const id = Number(country.id)
      const key = label.toLowerCase()
      const existing = mergedByKey.get(key)
      if (!existing) {
        mergedByKey.set(key, { id, label, iso2Code })
        continue
      }
      // Prefer the option with an ISO code when duplicate country names exist.
      if (!existing.iso2Code && iso2Code) {
        mergedByKey.set(key, { id, label, iso2Code })
      }
    }

    return Array.from(mergedByKey.values()).sort((a, b) => a.label.localeCompare(b.label))
  }

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

  const regionOptions = regions
  const useRegionDropdown = regionOptions.length > 0

  const renderRequiredIndicator = (isRequired: boolean) =>
    isRequired ? (
      <span className="text-red-500 ml-0.5">*</span>
    ) : (
      <span className="text-[0.8em] text-muted-foreground ml-0.5">(Optional)</span>
    )

  const getPasswordComplexityError = (password: string): string => {
    const p = password.trim()

    if (p.length < 6) {
      return "Password must be at least 6 characters"
    }

    const hasUppercase = /[A-Z]/.test(p)
    const hasSpecial = /[!@#$%^&*(),.?\":{}|<>]/.test(p)

    if (!hasUppercase || !hasSpecial) {
      return "Password must contain at least one uppercase letter and one special character"
    }

    return ""
  }

  // Full validation – used on submit
  const validatePassword = (password: string): string => {
    if (!password.trim()) {
      return "Password is required"
    }

    return getPasswordComplexityError(password)
  }

  // Soft validation – used while typing (no "required" error)
  const validatePasswordSoft = (password: string): string => {
    if (!password.trim()) {
      return ""
    }

    return getPasswordComplexityError(password)
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword.trim()) {
      return "Confirm password is required"
    }

    if (password !== confirmPassword) {
      return "Passwords do not match"
    }

    return ""
  }

  const handleSendVerificationCode = async () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }))
      return
    }

    setIsSendingCode(true)
    setVerificationError("")

    try {
      // First check if email is available
      await getJson("/api/authenticate/check-email-available?email=" + encodeURIComponent(formData.email))

      // If available, generate OTP
      await postJson("/api/otp/otp-generate", {
        email: formData.email,    
        firstName: formData.firstName,
      })
      setEmailVerificationSent(true)
      setLastVerificationEmail(normalizedCurrentEmail)
      setVerificationCode("")
    } catch (err: any) {
      setVerificationError(err.message || "Unable to send verification code. Please try again.")
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError("Please enter the verification code")
      return
    }

    setIsVerifying(true)
    setVerificationError("")

    try {
      await postJson("/api/otp/otp-verify", {
        email: formData.email,
        otp: verificationCode,
      })
      setIsEmailVerified(true)
      setVerificationError("")
    } catch (err: any) {
      setVerificationError(err.message || "Invalid verification code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleNext = () => {
    if (isOnboardingDemoLoading) return

    const newErrors: Record<string, string> = {}

    if (isOnboardingDemoEnabled) {
      setFieldErrors({})
      if (step < 4) setStep(step + 1)
      return
    }

    if (step === 1) {
      const loadCountries = async () => {
        setIsCountriesLoading(true)
        try {
          const result = await getJson<GetCountriesResponse>("/api/country/get-country")
          const options =
            result.data?.countries
              ?.map((country) => ({
                id: Number(country.id),
                label: (country.name || country.countryName || "").toString(),
                iso2Code: (country.iso2Code || country.isO2Code || "").toString().toUpperCase(),
              }))
              .filter((country) => country.id > 0 && country.label.trim().length > 0) ?? []
          setCountries(mergeCountryOptions(options))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to load countries", error)
          setCountries([])
        } finally {
          setIsCountriesLoading(false)
        }
      }
      void loadCountries()
      
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = "Name of rescue is required"
      }
      if (!formData.acronym.trim()) {
        newErrors.acronym = "Acronym is required"
      }
    } else if (step === 2) {
      
      if (!formData.street.trim()) {
        newErrors.street = "Street address is required"
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required"
      }
      if (!formData.state.trim()) {
        newErrors.state = "State/Province is required"
      }
      if (!formData.zip.trim()) {
        newErrors.zip = "Zip/Postal code is required"
      }
      if (!formData.countryId) {
        newErrors.country = "Country is required"
      }
    } else if (step === 3) {
      const website = formData.website.trim()

      if (!website) {
        newErrors.website = "Website is required"
      } else {
        try {
          // Allow plain domains like "www.happypaws.org" by auto-prepending https://
          const toValidate = /^https?:\/\//i.test(website) ? website : `https://${website}`
          new URL(toValidate)
        } catch {
          newErrors.website = "Please enter a valid website URL"
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }))
      return
    }

    // clear errors for current step when moving forward
    setFieldErrors((prev) => {
      const updated = { ...prev }
      if (step === 1) {
        delete updated.organizationName
        delete updated.acronym
      } else if (step === 2) {
        delete updated.street
        delete updated.city
        delete updated.state
        delete updated.country
      }
      return updated
    })

    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  useEffect(() => {
    const loadOnboardingDemoState = async () => {
      setIsOnboardingDemoLoading(true)
      try {
        const res = await getJsonNoAuth<{
          success: boolean
          statusCode: number
          data?: { enabled: boolean }
        }>("/api/authenticate/onboarding-demo-enabled")
        setIsOnboardingDemoEnabled(Boolean(res.data?.enabled))
      } catch {
        setIsOnboardingDemoEnabled(false)
      } finally {
        setIsOnboardingDemoLoading(false)
      }
    }

    void loadOnboardingDemoState()
  }, [])

  useEffect(() => {
    if (!isOnboardingDemoEnabled || isOnboardingDemoLoading) return

    const guardedUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    const createGuardState = () => ({
      ...(window.history.state ?? {}),
      registerDemoBackGuard: true,
    })

    if (!window.history.state?.registerDemoBackGuard) {
      window.history.pushState(createGuardState(), "", guardedUrl)
    }

    const handleBrowserBack = () => {
      window.history.pushState(createGuardState(), "", guardedUrl)
    }

    window.addEventListener("popstate", handleBrowserBack)
    return () => window.removeEventListener("popstate", handleBrowserBack)
  }, [isOnboardingDemoEnabled, isOnboardingDemoLoading])

  useEffect(() => {
    const loadRegions = async () => {
      if (step !== 2 || !formData.countryId) {
        setRegions([])
        return
      }

      setIsRegionsLoading(true)
      try {
        const data = await fetchRegions(formData.countryId)
        const options = data
          .map((region) => {
            const label = region.regionName?.trim() || ""
            const value = (region.regionCode?.trim() || label).toUpperCase()
            return { value, label }
          })
          .filter((region) => region.label.length > 0 && region.value.length > 0)
        setRegions(options)
      } catch (error) {
        console.error("Failed to load regions", error)
        setRegions([])
      } finally {
        setIsRegionsLoading(false)
      }
    }

    void loadRegions()
  }, [step, formData.countryId])

  const handleFormSubmit = (e: React.FormEvent) => {
    // Make Enter behave like clicking the primary action:
    // - steps 1-3: Next
    // - step 4: Create Account
    if (step < 4) {
      e.preventDefault()
      // If a dropdown popover is open, don't advance steps on Enter.
      if (isCountryOpen || isStateOpen) return
      handleNext()
      return
    }
    handleSubmit(e)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isOnboardingDemoLoading) return

    if (isOnboardingDemoEnabled) {
      setFieldErrors({})
      setVerificationError("")
      setSubmitError(null)
      setIsSubmitting(true)

      const demoId = Date.now()
      const demoFirstName = formData.firstName.trim() || "Demo"
      const demoLastName = formData.lastName.trim() || "User"
      const demoOrganizationName = formData.organizationName.trim() || `Demo Rescue ${demoId}`
      const demoAcronym = formData.acronym.trim() || "DEMO"
      const demoEmail = formData.email.trim() || `demo-${demoId}@totheirrescue.local`
      const demoUserId = formData.userId.trim() || `demo_${demoId}`

      const runDemoSignup = async () => {
        try {
          const response = await postJson<{
            token: string
            refreshToken: string
            data: {
              userName: string
              tenantId: number | null
              email: string
              onboardingDemoEnabled?: boolean
              countryDateFormat?: string | null
            }
          }>("/api/authenticate/signup-admin", {
            organizationName: demoOrganizationName,
            acronym: demoAcronym,
            street: formData.street.trim() || "Demo Street",
            city: formData.city.trim() || "Demo City",
            state: formData.state.trim() || "Demo State",
            zip: formData.zip.trim() || "00000",
            countryId: formData.countryId || 0,
            countryName: formData.countryName,
            countryISO2Code: selectedCountryISO2Code,
            website: formData.website.trim() || "https://demo.totheirrescue.local",
            firstName: demoFirstName,
            lastName: demoLastName,
            email: demoEmail,
            userId: demoUserId,
            password: "DemoPass!123",
            phone: formData.phone,
            onboardingDemoRegistration: true,
          })

          window.sessionStorage.setItem(
            "auth",
            JSON.stringify({
              token: response.token,
              refreshToken: response.refreshToken,
              user: {
                ...response.data,
                firstName: demoFirstName,
                lastName: demoLastName,
                tenantName: demoOrganizationName,
              },
            }),
          )

          router.push("/onboarding?onboardingMode=guided")
        } catch (err: any) {
          setSubmitError(err.message || "Unable to start demo onboarding. Please try again.")
        } finally {
          setIsSubmitting(false)
        }
      }

      void runDemoSignup()
      return
    }

    const newErrors: Record<string, string> = {}
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.userId.trim()) {
      newErrors.userId = "User ID is required"
    }
    const passwordError = validatePassword(formData.password)
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)

    if (passwordError) {
      newErrors.password = passwordError
    }
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }))
      return
    }

    if (!isEmailVerified) {
      setVerificationError("Please verify your email address before continuing")
      return
    }

    const run = async () => {
      setSubmitError(null)
      setIsSubmitting(true)
      try {
        const response = await postJson<{
          token: string
          refreshToken: string
          data: {
            userName: string
            tenantId: number | null
            email: string
            onboardingDemoEnabled?: boolean
            countryDateFormat?: string | null
          }
        }>("/api/authenticate/signup-admin", {
          organizationName: formData.organizationName,
          acronym: formData.acronym,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          countryId: formData.countryId,
          countryName: formData.countryName,
          countryISO2Code: selectedCountryISO2Code,
          website: formData.website,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userId: formData.userId,
          password: formData.password,
          phone: formData.phone,
        })
        window.sessionStorage.setItem(
          "auth",
          JSON.stringify({
            token: response.token,
            refreshToken: response.refreshToken,
            user: {
              ...response.data,
              firstName: formData.firstName.trim(),
              lastName: formData.lastName.trim(),
              tenantName: formData.organizationName.trim(),
            },
          }),
        )

        // Defensive sync: some backend signup flows may not persist all tenant location fields.
        // Best-effort update right after signup ensures country/zip are stored for Customization.
        if (response.data.tenantId) {
          try {
            await postJson(`/api/tenant/update-tenant/${response.data.tenantId}`, {
              name: formData.organizationName,
              tenantAcronym: formData.acronym,
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              website: formData.website,
              emailAddress: formData.email,
              phone: formData.phone,
              countryId: formData.countryId,
              countryName: formData.countryName,
              countryISO2Code: selectedCountryISO2Code,
            })
          } catch (updateErr) {
            // eslint-disable-next-line no-console
            console.warn("Post-signup tenant sync failed", updateErr)
          }
        }

        // Route to guided onboarding flow when enabled by Super Admin global setting.
        router.push(response.data.onboardingDemoEnabled ? "/onboarding?onboardingMode=guided" : "/onboarding")
      } catch (err: any) {
        setSubmitError(err.message || "Unable to create account. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }

    void run()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 bg-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-3xl blur-xl opacity-20" />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Image
                  src="/rabbit-logo.png"
                  alt="To Their Rescue"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  To Their Rescue
                </h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
              {isOnboardingDemoEnabled && (
                <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  Demo mode is active. You can continue without entering registration details.
                </p>
              )}
              {
                step === 1 && (
                  <p className="text-gray-600">Enter the Name and Acronym of your rescue or sanctuary</p>
                )
              }
              {
                step === 2 && (
                  <p className="text-gray-600">Where is your rescue located</p>
                )
              }
              {
                step === 3 && (
                  <p className="text-gray-600">Your social media page or website</p>
                )
              }
              {
                step === 4 && (
                  <p className="text-gray-600">Enter your personal information</p>
                )
              }
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {/* Step 1 - Organization */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= 1 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
              </div>
              {/* Connector 1 */}
              <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                  initial={{ width: "0%" }}
                  animate={{ width: step >= 2 ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {/* Step 2 - Location */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= 2 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 2 ? <Check className="w-5 h-5" /> : "2"}
                </div>
              </div>
              {/* Connector 2 */}
              <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                  initial={{ width: "0%" }}
                  animate={{ width: step >= 3 ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {/* Step 3 - Website */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= 3 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 3 ? <Check className="w-5 h-5" /> : "3"}
                </div>
              </div>
              {/* Connector 3 */}
              <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                  initial={{ width: "0%" }}
                  animate={{ width: step >= 4 ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {/* Step 4 - Personal Info */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= 4 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  4
                </div>
              </div>
            </div>

            <form noValidate onSubmit={handleFormSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FloatingInput
                          id="organizationName"
                          label="Name of rescue"
                          value={formData.organizationName}
                          autoFocus
                          onChange={(e) => {
                            setFormData({ ...formData, organizationName: e.target.value })
                            setFieldErrors((prev) => ({ ...prev, organizationName: "" }))
                          }}
                          error={fieldErrors.organizationName}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                            fieldErrors.organizationName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          required={!isOnboardingDemoEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <FloatingInput
                          id="acronym"
                          label="Acronym"
                          value={formData.acronym}
                          onChange={(e) => {
                            setFormData({ ...formData, acronym: e.target.value })
                            setFieldErrors((prev) => ({ ...prev, acronym: "" }))
                          }}
                          error={fieldErrors.acronym}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                            fieldErrors.acronym ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          required={!isOnboardingDemoEnabled}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Link href="/auth">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        onClick={handleNext}
                        size="lg"
                        disabled={isOnboardingDemoLoading}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FloatingInput
                          id="street"
                          label="Street Address"
                          autoFocus
                          value={formData.street}
                          onChange={(e) => {
                            setFormData({ ...formData, street: e.target.value })
                            setFieldErrors((prev) => ({ ...prev, street: "" }))
                          }}
                          error={fieldErrors.street}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                            fieldErrors.street ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          required={!isOnboardingDemoEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <FloatingInput
                          id="city"
                          label="City or Township Name"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value })
                            setFieldErrors((prev) => ({ ...prev, city: "" }))
                          }}
                          error={fieldErrors.city}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                            fieldErrors.city ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          required={!isOnboardingDemoEnabled}
                        />
                      </div>
                    </div>
                  

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <label
                            htmlFor="country"
                            className={cn(
                              "absolute left-3 transition-all duration-200 pointer-events-none z-10",
                              isCountryOpen || formData.countryId ? "top-1 text-xs" : "top-3 text-sm",
                              fieldErrors.country ? "text-red-500" : "text-muted-foreground",
                            )}
                          >
                            Country
                            {renderRequiredIndicator(!isOnboardingDemoEnabled)}
                          </label>
                          <Popover open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                id="country"
                                className={cn(
                                  "flex h-12 w-full items-center justify-between rounded-md border bg-white/50 px-3 pt-4 pb-1 text-sm text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                                  !formData.countryId && !isCountryOpen && "text-transparent",
                                  fieldErrors.country &&
                                    "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-100",
                                )}
                              >
                                <span>{formData.countryName || "Select a country"}</span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-400" />
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
                                        key={country.id}
                                        value={country.label}
                                        onSelect={() => {
                                          setFormData({
                                            ...formData,
                                            countryId: country.id,
                                            countryName: country.label,
                                            state: "",
                                          })
                                          setSelectedCountryISO2Code(country.iso2Code || "")
                                          setFieldErrors((prev) => ({ ...prev, country: "" }))
                                          setIsCountryOpen(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            formData.countryId === country.id ? "opacity-100" : "opacity-0",
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
                        </div>
                        {fieldErrors.country && (
                          <p className="text-sm text-red-600 mt-1">{fieldErrors.country}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        {useRegionDropdown ? (
                          <>
                            <div className="relative">
                              <label
                                htmlFor="state"
                                className={cn(
                                  "absolute left-3 transition-all duration-200 pointer-events-none z-10",
                                  isStateOpen || formData.state ? "top-1 text-xs" : "top-3 text-sm",
                                  fieldErrors.state ? "text-red-500" : "text-muted-foreground",
                                )}
                              >
                                State/Province/Locality
                                {renderRequiredIndicator(!isOnboardingDemoEnabled)}
                              </label>
                              <Popover open={isStateOpen} onOpenChange={setIsStateOpen}>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    id="state"
                                    className={cn(
                                      "flex h-12 w-full items-center justify-between rounded-md border bg-white/50 px-3 pt-4 pb-1 text-sm text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                                      !formData.state && !isStateOpen && "text-transparent",
                                      fieldErrors.state &&
                                        "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-100",
                                    )}
                                  >
                                    <span>
                                      {formData.state
                                        ? regionOptions.find((s) => s.value === formData.state)?.label ?? formData.state
                                        : isRegionsLoading
                                        ? "Loading..."
                                        : "Select a state/province/locality"}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-400" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[280px] p-0" align="start">
                                  <Command>
                                    <CommandInput placeholder="Search state..." />
                                    <CommandList>
                                      <CommandEmpty>No state found.</CommandEmpty>
                                      <CommandGroup>
                                        {regionOptions.map((state) => (
                                          <CommandItem
                                            key={state.value}
                                            value={`${state.label} ${state.value}`}
                                            onSelect={() => {
                                              setFormData({ ...formData, state: state.value })
                                              setFieldErrors((prev) => ({ ...prev, state: "" }))
                                              setIsStateOpen(false)
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                formData.state === state.value ? "opacity-100" : "opacity-0",
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
                            </div>
                          </>
                        ) : (
                          <FloatingInput
                            id="state"
                            label="State/Province/Locality"
                            value={formData.state}
                            onChange={(e) => {
                              setFormData({ ...formData, state: e.target.value })
                              setFieldErrors((prev) => ({ ...prev, state: "" }))
                            }}
                            error={fieldErrors.state}
                            className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                              fieldErrors.state ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                            required={!isOnboardingDemoEnabled}
                          />
                        )}
                        {fieldErrors.state && <p className="text-sm text-red-600 mt-1">{fieldErrors.state}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FloatingInput
                        id="zip"
                        label="Zip/Postal Code"
                        value={formData.zip}
                        onChange={(e) => {
                          setFormData({ ...formData, zip: e.target.value })
                          setFieldErrors((prev) => ({ ...prev, zip: "" }))
                        }}
                        error={fieldErrors.zip}
                        className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                          fieldErrors.zip ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        required={!isOnboardingDemoEnabled}
                      />
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        size="lg"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        size="lg"
                        disabled={isOnboardingDemoLoading}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <FloatingInput
                        id="website"
                        label="Website/Social Media"
                        autoFocus
                        value={formData.website}
                        onChange={(e) => {
                          setFormData({ ...formData, website: e.target.value })
                          setFieldErrors((prev) => ({ ...prev, website: "" }))
                        }}
                        error={fieldErrors.website}
                        className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                          fieldErrors.website ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        required={!isOnboardingDemoEnabled}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        size="lg"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        size="lg"
                        disabled={isOnboardingDemoLoading}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FloatingInput
                          id="firstName"
                          autoFocus
                          label="First Name"
                          value={formData.firstName}
                          onChange={(e) => {
                            setFormData({ ...formData, firstName: e.target.value })
                            setFieldErrors((prev) => ({ ...prev, firstName: "" }))
                          }}
                          error={fieldErrors.firstName}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                            fieldErrors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          required={!isOnboardingDemoEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <FloatingInput
                          id="lastName"
                          label="Last Name"
                          value={formData.lastName}
                          onChange={(e) => {
                            setFormData({ ...formData, lastName: e.target.value })
                            setFieldErrors((prev) => ({ ...prev, lastName: "" }))
                          }}
                          error={fieldErrors.lastName}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                            fieldErrors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          required={!isOnboardingDemoEnabled}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <FloatingInput
                            id="email"
                            type="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value })
                              setEmailVerificationSent(false)
                              setIsEmailVerified(false)
                              setVerificationCode("")
                              setVerificationError("")
                              setFieldErrors((prev) => ({ ...prev, email: "" }))
                            }}
                            error={fieldErrors.email}
                            className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                              fieldErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                            required={!isOnboardingDemoEnabled}
                            disabled={!isOnboardingDemoEnabled && isEmailVerified}
                          />
                        </div>
                      
                        {!isEmailVerified && (
                          <Button
                            type="button"
                            onClick={handleSendVerificationCode}
                            disabled={!formData.email || isSendingCode || (emailVerificationSent && !hasEmailChangedSinceLastCode)}
                            className="h-12 shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          >
                            {isSendingCode ? (
                              "Sending..."
                            ) : emailVerificationSent ? (
                              "Code Sent"
                            ) : hasEmailChangedSinceLastCode ? (
                              "Resend Code"
                            ) : (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Code
                              </>
                            )}
                          </Button>
                        )}
                        {isEmailVerified && (
                          <div className="h-12 px-4 shrink-0 flex items-center bg-emerald-50 border border-emerald-200 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
                            <span className="text-emerald-700 font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {emailVerificationSent && !isEmailVerified && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2 pt-2"
                          >
                            <div className="flex gap-2">
                              <FloatingInput
                                id="verificationCode"
                                label="Verification Code"
                                value={verificationCode}
                                onChange={(e) => {
                                  setVerificationCode(e.target.value)
                                  setVerificationError("")
                                }}
                                maxLength={6}
                                className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 flex-1"
                                required
                              />
                              <Button
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={!verificationCode || isVerifying}
                                className="h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                              >
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                              Check your in-box and spam folder for the verification code. It may take a few minutes to arrive.
                            </p>
                            <div className="pt-1">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleSendVerificationCode}
                                disabled={!formData.email || isSendingCode}
                                className="h-10"
                              >
                                {isSendingCode ? "Sending..." : "Send New Code"}
                              </Button>
                              <p className="mt-2 text-xs text-gray-500">
                                Didn&apos;t get it? Send a new code.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {verificationError && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-red-600 text-sm mt-2"
                        >
                          <XCircle className="w-4 h-4" />
                          {verificationError}
                        </motion.div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FloatingInput
                          id="userId"
                          label="User ID"
                          value={formData.userId}
                          onChange={(e) => {
                            setFormData({ ...formData, userId: e.target.value })
                            setFieldErrors((prev) => ({ ...prev, userId: "" }))
                          }}
                          error={fieldErrors.userId}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                            fieldErrors.userId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          disabled={!isOnboardingDemoEnabled && !isEmailVerified}
                          required={!isOnboardingDemoEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <FloatingInput
                          id="phone"
                          type="tel"
                          label="Phone Number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          disabled={!isOnboardingDemoEnabled && !isEmailVerified}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <FloatingInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          label="Password"
                          value={formData.password}
                          onChange={(e) => {
                            const value = e.target.value
                            setFormData({ ...formData, password: value })
                            setFieldErrors((prev) => {
                              const updated = { ...prev }

                              const passwordError = validatePasswordSoft(value)
                              updated.password = passwordError

                              // Only validate confirmPassword in real-time if it has a value
                              if (formData.confirmPassword.trim()) {
                                updated.confirmPassword = validateConfirmPassword(value, formData.confirmPassword)
                              }

                              return updated
                            })
                          }}
                          error={fieldErrors.password}
                          className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 pr-12 ${
                            fieldErrors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          }`}
                          disabled={!isOnboardingDemoEnabled && !isEmailVerified}
                          required={!isOnboardingDemoEnabled}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FloatingInput
                        id="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          const value = e.target.value
                          setFormData({ ...formData, confirmPassword: value })
                          setFieldErrors((prev) => ({
                            ...prev,
                            confirmPassword: value.trim()
                              ? validateConfirmPassword(formData.password, value)
                              : "",
                          }))
                        }}
                        error={fieldErrors.confirmPassword}
                        className={`h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${
                          fieldErrors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        disabled={!isOnboardingDemoEnabled && !isEmailVerified}
                        required={!isOnboardingDemoEnabled}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        size="lg"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
                        disabled={isOnboardingDemoLoading || (!isOnboardingDemoEnabled && !isEmailVerified) || isSubmitting}
                      >
                        {isOnboardingDemoEnabled
                          ? isSubmitting ? "Starting Demo..." : "Next"
                          : isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                    {submitError && (
                      <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                        {submitError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
