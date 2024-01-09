import React from 'react'
import {
  CreditCard,
  Description,
  Check,
  Undo,
  MoreHoriz,
  Healing,
  Close,
} from '@mui/icons-material'

export const petLicenseTiles = [
  {
    id: 1,
    formattedLabel: 'totalApplications',
    count: 0,
    icon: <Description />,
    status: [
      'Applied',
      'Approved by Clerk',
      'Approved by HOD',
      'Reassigned by Clerk',
      'Reassigned by HOD',
      'Rejected by HOD',
      'Payment Successful',
      'License Generated',
    ],
  },
  {
    id: 2,
    formattedLabel: 'pending',
    count: 0,
    icon: <MoreHoriz />,
    status: ['Applied', 'Approved by Clerk'],
  },
  {
    id: 3,
    formattedLabel: 'approved',
    count: 0,
    icon: <Check />,
    status: ['Approved by HOD'],
  },
  {
    id: 4,
    formattedLabel: 'reassigned',
    count: 0,
    icon: <Undo />,
    status: ['Reassigned by Clerk', 'Reassigned by HOD', 'Rejected by HOD'],
  },
  {
    id: 5,
    formattedLabel: 'paidApplications',
    count: 0,
    icon: <CreditCard />,
    status: ['Payment Successful', 'License Generated'],
  },
]
export const renewedPetLicenseTiles = [
  {
    id: 1,
    formattedLabel: 'totalApplications',
    count: 0,
    icon: <Description />,
    status: [
      'Applied',
      'Approved by Clerk',
      'Approved by HOD',
      'Reassigned by Clerk',
      'Reassigned by HOD',
      'Rejected by HOD',
      'Payment Successful',
      'License Generated',
    ],
  },
  {
    id: 2,
    formattedLabel: 'pending',
    count: 0,
    icon: <MoreHoriz />,
    status: ['Applied', 'Approved by Clerk'],
  },
  {
    id: 3,
    formattedLabel: 'approved',
    count: 0,
    icon: <Check />,
    status: ['Approved by HOD'],
  },
  {
    id: 4,
    formattedLabel: 'reassigned',
    count: 0,
    icon: <Undo />,
    status: ['Reassigned by Clerk', 'Reassigned by HOD', 'Rejected by HOD'],
  },
  {
    id: 5,
    formattedLabel: 'paidApplications',
    count: 0,
    icon: <CreditCard />,
    status: ['Payment Successful', 'License Generated'],
  },
]
export const opdTiles = [
  {
    id: 1,
    formattedLabel: 'totalApplications',
    count: 0,
    icon: <Description />,
    status: ['Initiated', 'Awaiting Payment', 'Payment Successful'],
  },
  {
    id: 2,
    formattedLabel: 'pending',
    count: 0,
    icon: <MoreHoriz />,
    status: ['Initiated'],
  },
  {
    id: 2,
    label: 'Unpaid Applications',
    formattedLabel: 'unpaidApplications',

    count: 0,
    icon: <MoreHoriz />,
    status: ['Awaiting Payment'],
  },
  {
    id: 3,
    formattedLabel: 'paidApplications',
    count: 0,
    icon: <CreditCard />,
    status: ['Payment Successful'],
  },
]
export const ipdTiles = [
  {
    id: 1,
    formattedLabel: 'totalApplications',
    count: 0,
    icon: <Description />,
    status: ['Initiated', 'Under Treatment', 'Dead', 'Released'],
  },
  {
    id: 2,
    formattedLabel: 'pending',
    count: 0,
    icon: <MoreHoriz />,
    status: ['Initiated'],
  },
  {
    id: 3,
    formattedLabel: 'underTreatment',
    count: 0,
    icon: <Healing />,
    status: ['Under Treatment'],
  },
  {
    id: 4,
    formattedLabel: 'dead',
    count: 0,
    icon: <Close />,
    status: ['Dead'],
  },
  {
    id: 5,
    formattedLabel: 'released',
    count: 0,
    icon: <Check />,
    status: ['Released'],
  },
]
