import { createClient } from "@supabase/supabase-js";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class SupabaseUserRepository implements UserRepository {
  private supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_KEY || ""
  );

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from("User")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      return null;
    }

    return new User(
      data.id,
      data.username,
      data.password_hash,
      data.role,
      data.created_at ? new Date(data.created_at) : undefined
    );
  }

  async findById(id: number): Promise<User | null> {
    const { data, error } = await this.supabase
      .from("User")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return new User(
      data.id,
      data.username,
      data.password_hash,
      data.role,
      data.created_at ? new Date(data.created_at) : undefined
    );
  }
}
