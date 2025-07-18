export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_meeting: string
          appointment_time: string
          appointment_with: string
          created_at: string
          id: string
          participants: string | null
          priority: string | null
          purpose: string
          reminder_time: number | null
          status: string | null
          tour_programme_id: string | null
          updated_at: string
          user_id: string
          venue: string
        }
        Insert: {
          appointment_date: string
          appointment_meeting: string
          appointment_time: string
          appointment_with: string
          created_at?: string
          id?: string
          participants?: string | null
          priority?: string | null
          purpose: string
          reminder_time?: number | null
          status?: string | null
          tour_programme_id?: string | null
          updated_at?: string
          user_id: string
          venue: string
        }
        Update: {
          appointment_date?: string
          appointment_meeting?: string
          appointment_time?: string
          appointment_with?: string
          created_at?: string
          id?: string
          participants?: string | null
          priority?: string | null
          purpose?: string
          reminder_time?: number | null
          status?: string | null
          tour_programme_id?: string | null
          updated_at?: string
          user_id?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_tour_programme_id_fkey"
            columns: ["tour_programme_id"]
            isOneToOne: false
            referencedRelation: "tour_programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          employee_id: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tour_programmes: {
        Row: {
          created_at: string
          duty_leave: string
          from_date: string
          from_location: string | null
          id: string
          officer: string
          out_to: string | null
          purpose: string
          status: string | null
          to_date: string
          to_location: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duty_leave: string
          from_date: string
          from_location?: string | null
          id?: string
          officer: string
          out_to?: string | null
          purpose: string
          status?: string | null
          to_date: string
          to_location?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duty_leave?: string
          from_date?: string
          from_location?: string | null
          id?: string
          officer?: string
          out_to?: string | null
          purpose?: string
          status?: string | null
          to_date?: string
          to_location?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
