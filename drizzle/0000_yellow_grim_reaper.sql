CREATE TABLE `ads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`photo` text DEFAULT '' NOT NULL,
	`link` text DEFAULT '' NOT NULL,
	`link_type` text DEFAULT 'instagram',
	`country_id` integer,
	`city_id` integer,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`name_ru` text DEFAULT '' NOT NULL,
	`name_en` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `cities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`country_id` integer,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cities_slug_unique` ON `cities` (`slug`);--> statement-breakpoint
CREATE TABLE `countries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image` text DEFAULT '',
	`created_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `countries_slug_unique` ON `countries` (`slug`);--> statement-breakpoint
CREATE TABLE `designers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`photo` text DEFAULT '' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`story` text DEFAULT '' NOT NULL,
	`why_locals_wear` text DEFAULT '' NOT NULL,
	`instagram` text DEFAULT '',
	`website` text DEFAULT '',
	`address` text DEFAULT '',
	`city_id` integer,
	`featured` integer DEFAULT false,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `designers_slug_unique` ON `designers` (`slug`);--> statement-breakpoint
CREATE TABLE `item_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer,
	`url` text NOT NULL,
	`alt` text DEFAULT '',
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`story` text DEFAULT '' NOT NULL,
	`material` text DEFAULT '' NOT NULL,
	`price_local` real DEFAULT 0,
	`price_usd` real DEFAULT 0,
	`currency` text DEFAULT 'USD',
	`designer_id` integer,
	`category_id` integer,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`designer_id`) REFERENCES `designers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `items_slug_unique` ON `items` (`slug`);