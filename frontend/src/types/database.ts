export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      societies: {
        Row: Society
        Insert: Omit<Society, 'id'>
        Update: Partial<Omit<Society, 'id'>>
      }
      residents: {
        Row: Resident
        Insert: Omit<Resident, 'id'>
        Update: Partial<Omit<Resident, 'id'>>
      }
      flats: {
        Row: Flat
        Insert: Omit<Flat, 'id'>
        Update: Partial<Omit<Flat, 'id'>>
      }
      maintenance_bills: {
        Row: MaintenanceBill
        Insert: Omit<MaintenanceBill, 'id'>
        Update: Partial<Omit<MaintenanceBill, 'id'>>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id'>
        Update: Partial<Omit<Payment, 'id'>>
      }
      complaints: {
        Row: Complaint
        Insert: Omit<Complaint, 'id'>
        Update: Partial<Omit<Complaint, 'id'>>
      }
      notices: {
        Row: Notice
        Insert: Omit<Notice, 'id'>
        Update: Partial<Omit<Notice, 'id'>>
      }
      visitors: {
        Row: Visitor
        Insert: Omit<Visitor, 'id'>
        Update: Partial<Omit<Visitor, 'id'>>
      }
      amenity_bookings: {
        Row: AmenityBooking
        Insert: Omit<AmenityBooking, 'id'>
        Update: Partial<Omit<AmenityBooking, 'id'>>
      }
    }
  }
}

export interface Society {
  id: string
  name: string
  address: string
  city: string
  pincode: string
  total_flats: number
}

export interface Resident {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  flat_id: string
  ownership_type: 'Owner' | 'Tenant'
  status: 'Active' | 'Inactive'
  move_in_date: string
  role?: 'admin' | 'resident'
}

export interface Flat {
  id: string
  flat_number: string
  block: string
  floor: number
  type: string
  area: number
  status: 'Occupied' | 'Vacant' | 'Maintenance'
  society_id: string
}

export interface MaintenanceBill {
  id: string
  flat_id: string
  month: string
  year: number
  base_amount: number
  water_charges: number
  other_charges: number
  total_amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
}

export interface Payment {
  id: string
  bill_id: string
  amount_paid: number
  payment_date: string
  payment_mode: 'UPI' | 'Card' | 'Cash' | 'Bank Transfer'
  transaction_id: string
}

export interface Complaint {
  id: string
  resident_id: string
  flat_id: string
  category: string
  subject: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'In Progress' | 'Resolved'
  created_at: string
}

export interface Notice {
  id: string
  title: string
  category: string
  content: string
  priority: 'Normal' | 'Urgent'
  created_by: string
  created_at: string
}

export interface Visitor {
  id: string
  name: string
  phone: string
  purpose: string
  flat_id: string
  check_in_time: string
  check_out_time?: string
  vehicle_number?: string
}

export interface AmenityBooking {
  id: string
  resident_id: string
  amenity_name: string
  booking_date: string
  time_slot: string
  status: 'Confirmed' | 'Cancelled' | 'Pending'
}
