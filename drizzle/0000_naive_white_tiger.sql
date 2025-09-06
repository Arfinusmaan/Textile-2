CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`category` text NOT NULL,
	`subcategory` text NOT NULL,
	`fabric` text NOT NULL,
	`sizes` text NOT NULL,
	`colors` text NOT NULL,
	`images` text NOT NULL,
	`stock_quantity` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`reviewer_name` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`helpful_count` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
