-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "courses_isPublished_idx" ON "courses"("isPublished");

-- CreateIndex
CREATE INDEX "earning_transactions_status_idx" ON "earning_transactions"("status");

-- CreateIndex
CREATE INDEX "earning_transactions_type_idx" ON "earning_transactions"("type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "opportunities_category_idx" ON "opportunities"("category");

-- CreateIndex
CREATE INDEX "opportunities_deadline_idx" ON "opportunities"("deadline");

-- CreateIndex
CREATE INDEX "opportunity_skills_skillId_idx" ON "opportunity_skills"("skillId");

-- CreateIndex
CREATE INDEX "payments_type_idx" ON "payments"("type");

-- CreateIndex
CREATE INDEX "project_skills_skillId_idx" ON "project_skills"("skillId");

-- CreateIndex
CREATE INDEX "sessions_mentorUserId_idx" ON "sessions"("mentorUserId");

-- CreateIndex
CREATE INDEX "sessions_scheduledAt_idx" ON "sessions"("scheduledAt");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "skill_exchange_requests_receiverId_idx" ON "skill_exchange_requests"("receiverId");

-- CreateIndex
CREATE INDEX "skill_exchange_requests_offeringSkillId_idx" ON "skill_exchange_requests"("offeringSkillId");

-- CreateIndex
CREATE INDEX "skill_exchange_requests_seekingSkillId_idx" ON "skill_exchange_requests"("seekingSkillId");

-- CreateIndex
CREATE INDEX "user_skills_skillId_idx" ON "user_skills"("skillId");

-- CreateIndex
CREATE INDEX "verification_requests_projectId_idx" ON "verification_requests"("projectId");

-- CreateIndex
CREATE INDEX "verification_requests_reviewerId_idx" ON "verification_requests"("reviewerId");
