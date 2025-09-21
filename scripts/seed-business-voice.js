#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/naraddon';

const sourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    publishedAt: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const answerSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['community', 'expert', 'examiner', 'consultant'],
    },
    displayName: { type: String, required: true, trim: true },
    headline: { type: String, trim: true },
    title: { type: String, trim: true },
    organization: { type: String, trim: true },
    content: { type: String, required: true, trim: true },
    isPinned: { type: Boolean, default: false },
    sources: { type: [sourceSchema], default: undefined },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    author: {
      nickname: { type: String, required: true, trim: true },
      businessType: { type: String, required: true, trim: true },
      region: { type: String, required: true, trim: true },
      yearsInBusiness: { type: Number, min: 0, max: 200, default: null },
    },
    metrics: {
      viewCount: { type: Number, default: 0, min: 0 },
      commentCount: { type: Number, default: 0, min: 0 },
      scrapCount: { type: Number, default: 0, min: 0 },
    },
    flags: {
      needsExpertReply: { type: Boolean, default: false },
      needsExaminerReply: { type: Boolean, default: false },
    },
    sources: { type: [sourceSchema], default: [] },
    answers: { type: [answerSchema], default: [] },
  },
  { timestamps: true }
);

const BusinessVoiceQuestion = mongoose.models.BusinessVoiceQuestion ||
  mongoose.model('BusinessVoiceQuestion', questionSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);

  const seedPath = path.resolve(process.cwd(), 'data', 'business_voice_seed.json');
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found: ${seedPath}`);
  }

  const raw = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  const questions = Array.isArray(raw.questions) ? raw.questions : [];

  const timestamp = new Date();

  await BusinessVoiceQuestion.deleteMany({});
  await BusinessVoiceQuestion.insertMany(
    questions.map((question) => ({
      ...question,
      category: question.category?.toLowerCase(),
      createdAt: timestamp,
      updatedAt: timestamp,
    }))
  );

  console.log(`Inserted ${questions.length} Business Voice questions.`);
}

main()
  .catch((error) => {
    console.error('Failed to seed Business Voice questions:', error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
